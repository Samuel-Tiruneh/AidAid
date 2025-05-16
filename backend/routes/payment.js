const express = require('express');
const { body, validationResult } = require('express-validator');
const { initiateChapaPayment } = require('../utils/chapaPayment');
const Donation = require('../models/Donation');
const RequestDonate = require('../models/RequestDonate'); // Make sure to import
const User = require('../models/User'); // Import User model
const router = express.Router();

const validateDonation = [
  body('amount')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0')
    .toFloat(),
  body('phone')
    .trim()
    .matches(/^(\+251|0)[9][0-9]{8}$/).withMessage('Invalid Ethiopian phone number'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('recipientName').trim().notEmpty().withMessage('Recipient name is required'),
  body('requester').notEmpty().withMessage('Requester ID is required'),
  body('donor').notEmpty().withMessage('Donor ID is required') // Add donor validation
];

router.post('/process', validateDonation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify donor exists
    const donor = await User.findById(req.body.donor);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    // Verify requester exists
    const requester = await RequestDonate.findById(req.body.requester);
    if (!requester) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check for duplicate donations
    const existingDonation = await Donation.findOne({
      amount: req.body.amount,
      phone: req.body.phone,
      fullName: req.body.fullName,
      recipientName: req.body.recipientName,
      status: 'completed'
    });

    if (existingDonation) {
      return res.status(400).json({
        error: 'Duplicate donation detected',
        existingTransaction: existingDonation.transactionId
      });
    }

    const generateTransactionId = () => {
      return `${req.body.paymentMethod.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    // Create donation with donor reference
    const donation = new Donation({
      ...req.body,
      requester: req.body.requester,
      donor: req.body.donor, // Include donor ID
      status: 'pending',
      transactionId: generateTransactionId(),
      createdAt: new Date()
    });

    // Process Chapa payment if applicable
    if (donation.paymentMethod === 'Chapa') {
      const paymentResponse = await initiateChapaPayment(donation);
      donation.transactionId = paymentResponse.tx_ref;
      donation.checkoutUrl = paymentResponse.data.checkout_url;
    }

    await donation.save();
    
    // Update amount raised if completed
    if (donation.status === 'completed') {
      await RequestDonate.findByIdAndUpdate(donation.requester, {
        $inc: { amountRaised: donation.amount }
      });
    }

    // Return appropriate response
    if (donation.paymentMethod === 'Chapa') {
      return res.json({
        ...donation.toObject(),
        checkoutUrl: donation.checkoutUrl,
        requiresRedirect: true,
        donorInfo: { // Optional: include donor details
          name: donor.username,
          email: donor.email
        }
      });
    }

    res.status(201).json({
      ...donation.toObject(),
      donorInfo: { // Optional: include donor details
        name: donor.username,
        email: donor.email
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);

    if (error.code === 11000 && error.keyPattern?.transactionId) {
      return res.status(400).json({
        error: 'Transaction ID conflict. Please try again.',
        code: 'DUPLICATE_TRANSACTION'
      });
    }

    res.status(400).json({ 
      error: error.message,
      ...(error.errors && { details: error.errors })
    });
  }
});

module.exports = router;