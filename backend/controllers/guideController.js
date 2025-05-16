const Guide = require('../models/Guide');

// GET /api/guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json({ success: true, data: guides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/guides (manual upload)
exports.createGuide = async (req, res) => {
  const { title, description, videoUrl, thumbnailUrl } = req.body;

  try {
    const newGuide = new Guide({ title, description, videoUrl, thumbnailUrl });
    await newGuide.save();
    res.status(201).json({ success: true, data: newGuide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};