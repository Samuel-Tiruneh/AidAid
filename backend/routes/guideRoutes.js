const express = require('express');
const router = express.Router();
const { getAllGuides, createGuide } = require('../controllers/guideController');

router.get('/', getAllGuides);
router.post('/', createGuide);

module.exports = router;