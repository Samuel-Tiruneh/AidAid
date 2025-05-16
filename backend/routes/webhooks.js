const express = require('express');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const router = express.Router();

// Use express.raw() to get raw body for signature verification
router.post('/chapa', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const chapaSignature = req.headers['chapa-signature'];
    const xChapaSignature = req.headers['x-chapa-signature'];

    // Properly extract raw body (avoids Buffer issues)
    const rawBody = Buffer.from(req.body).toString("utf8"); 

    const secret = process.env.CHAPA_WEBHOOK_SECRET;
    if (!secret) {
      console.error('🔴 CHAPA_WEBHOOK_SECRET is not set!');
      return res.status(500).send('Server configuration error');
    }

    // Generate expected HMAC hash for both signature options
    const expectedHashFromSecret = crypto.createHmac('sha256', secret)
      .update(secret) // Secret signed with itself
      .digest('hex');

    const expectedHashFromPayload = crypto.createHmac('sha256', secret)
      .update(rawBody) // Corrected raw body format
      .digest('hex');

    // Debug logs for deeper inspection
    console.log('Received Chapa-Signature:', chapaSignature);
    console.log('Received x-Chapa-Signature:', xChapaSignature);
    console.log('Expected Hash (Secret):', expectedHashFromSecret);
    console.log('Expected Hash (Payload):', expectedHashFromPayload);
    console.log('Raw Payload:', rawBody); // Correctly formatted request body

    // Check if at least one valid signature exists
    if (chapaSignature !== expectedHashFromSecret && xChapaSignature !== expectedHashFromPayload) {
      console.error('🔴 Signature mismatch detected!');
      return res.status(400).send('Invalid signature');
    }

    // Parse the JSON body after verifying signature
    const payload = JSON.parse(rawBody);
    const { tx_ref, status } = payload;

    // Update donation status in DB
    const donation = await Donation.findOneAndUpdate(
      { transactionId: tx_ref },
      { status: status === 'success' ? 'completed' : 'failed' },
      { new: true }
    );

    if (!donation) {
      return res.status(404).send('Donation not found');
    }

    console.log('🟢 Donation updated successfully:', donation);
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('🔴 Webhook processing error:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
