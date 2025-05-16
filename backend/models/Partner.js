const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String, required: true },
    website: {type:String},
    type: { type: String, required: true },
    message: { type: String, required: true },
    logoUrl: { type: String, required: true },
    documentUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);