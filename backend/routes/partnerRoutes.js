const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const upload = require('../middleware/uploadMiddleware');

// POST endpoint for creating new partners
router.post(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  partnerController.createPartner
);

// GET endpoint for retrieving all partners (NEWLY ADDED)
router.get('/count', partnerController.getPartnersCount);
router.get('/', partnerController.getAllPartners);

module.exports = router;