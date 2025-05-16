// models/Donation.js
const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  phone: { type: String, required: true },
  fullName: { type: String, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Chapa", "Arifpay", "Bank"],
  },
  paymentOption: {
    type: String,
    enum: ["Telebirr", "CBE Birr"],
    required: function () {
      return ["Chapa", "Arifpay"].includes(this.paymentMethod);
    },
  },
  bank: {
    type: String,
    enum: ["CBE", "Awash", "Dashen", "Abyssinia", "Wegagen", "Nib", "Berhan"],
    required: function () {
      return this.paymentMethod === "Bank";
    },
  },
  accountNumber: {
    type: String,
    required: function () {
      return this.paymentMethod === "Bank";
    },
  },
  transactionId: { type: String, unique: true, sparse: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RequestDonate",
    required: true,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Donation", DonationSchema);