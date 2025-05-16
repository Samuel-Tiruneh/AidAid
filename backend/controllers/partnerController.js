const Partner = require('../models/Partner');
const cloudinary = require('../cloudinary');

exports.createPartner = async (req, res) => {
  try {
    const { name, email, website, organization, type, message } = req.body;

    // Validate required fields
    if (!name || !email || !website || !organization || !type || !message) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.logo) {
      return res.status(400).json({ 
        success: false,
        message: "Logo is required" 
      });
    }

    // Get Cloudinary URLs from uploaded files
    const logoUrl = req.files.logo[0].path;
    const documentUrl = req.files.document ? req.files.document[0].path : null;

    // Create new partner
    const partner = new Partner({
      name,
      email,
      website,
      organization,
      type,
      message,
      logoUrl,
      documentUrl
    });

    await partner.save();

    res.status(201).json({
      success: true,
      data: partner
    });

  } catch (error) {
    console.error("Error creating partner:", error);
    
    // Delete uploaded files from Cloudinary if error occurs
    if (req.files?.logo) {
      try {
        const publicId = req.files.logo[0].filename.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`partner-logos/${publicId}`);
      } catch (err) {
        console.error("Error deleting logo from Cloudinary:", err);
      }
    }
    
    if (req.files?.document) {
      try {
        const publicId = req.files.document[0].filename.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`partner-documents/${publicId}`);
      } catch (err) {
        console.error("Error deleting document from Cloudinary:", err);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

// Add this to your partnerController.js file
exports.getAllPartners = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const { type, sort } = req.query;
    
    // Build the query object
    const query = {};
    if (type) {
      query.type = type;
    }

    // Build the sort object
    const sortOptions = {};
    if (sort === 'newest') {
      sortOptions.createdAt = -1; // Newest first
    } else if (sort === 'oldest') {
      sortOptions.createdAt = 1; // Oldest first
    } else if (sort === 'name') {
      sortOptions.organization = 1; // A-Z
    }

    // Get partners from database
    const partners = await Partner.find(query)
      .sort(sortOptions)
      .select('-__v'); // Exclude the __v field

    // If no partners found
    if (!partners || partners.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No partners found'
      });
    }

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });

  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching partners'
    });
  }
};

exports.getPartnersCount = async (req, res) => {
  try {
    const count = await Partner.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};