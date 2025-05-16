const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinary'); // Your existing Cloudinary config
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Create storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: file.fieldname === 'logo' ? 'partner-logos' : 'partner-documents',
      allowed_formats: file.fieldname === 'logo' ? ['jpg', 'jpeg', 'png'] : ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: 'auto',
      transformation: file.fieldname === 'logo' ? [{ width: 500, height: 500, crop: 'limit' }] : null
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'logo') {
    // Validate image files
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid logo file type. Only JPEG/PNG allowed.'), false);
    }
  } else {
    // Validate document files
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document file type. Only JPEG/PNG/PDF allowed.'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;