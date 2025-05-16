const mongoose = require('mongoose');

const RequestDonateSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },

  // Case Information
  category: {
    type: String,
    enum: ['Education', 'Medical', 'Business', 'Emergency', 'Housing', 'Other'],
    required: [true, 'Category is required']
  },
  neededAmount: {
    type: Number,
    required: [true, 'Amount needed is required'],
    min: [1, 'Amount must be at least 1 ETB']
  },
  durationDays: {
    type: Number,
    default: 30,
    min: [1, 'Duration must be at least 1 day'],
    max: [90, 'Duration cannot exceed 90 days']
  },
  caseDescription: {
    type: String,
    required: [true, 'Case description is required'],
    maxlength: [100, 'Case description cannot exceed 100 characters']
  },
  story: {
    type: String,
    required: [true, 'Story is required'],
    maxlength: [5000, 'Story cannot exceed 5000 characters']
  },

  // Media Files
  photo: {
    type: String,
    required: [true, 'Photo is required']
  },
  document: {
    type: String,
    required: [true, 'Document is required']
  },
  video: {
    type: String
  },
  additionalPhotos: [{
    type: String
  }],
  additionalDocuments: [{
    type: String
  }],

  // Payment Information
  bank: {
    type: String,
    enum: ['CBE', 'Awash', 'Dashen', 'Abyssinia', 'Wegagen', 'Nib', 'Berhan'],
    required: [true, 'Bank is required']
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required']
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Mobile Banking', 'Other'],
    required: [true, 'Payment method is required']
  },

  // Metadata
  requestStatus: {
    type: String,
    enum: ['New', 'Approved', 'NeedRevise', 'Rejected'],
    default: 'New'
  },
  
  donationStatus: {
    type: String,
    enum: ['NotActive', 'Active', 'Paused', 'Completed'],
    default: 'NotActive'
  },

  startTime: {
    type: Date
  },
  stopTime: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  amountRaised: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  messages: [{
    sender: {
      type: String,
      enum: ['Admin', 'Requester'],
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  revisionCount: {
    type: Number,
    default: 0
  },
  lastRevisedAt: {
    type: Date
  }
});

// Update the updatedAt field before saving
RequestDonateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RequestDonate', RequestDonateSchema);