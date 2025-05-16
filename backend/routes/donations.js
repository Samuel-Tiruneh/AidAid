// const express = require('express');
// const router = express.Router();
// const Donation = require('../models/Donation');
// const RequestDonate = require('../models/RequestDonate'); // Import RequestDonate model
// const User = require('../models/User');
// const mongoose = require('mongoose');

// const toObjectId = (id) => {
//   try {
//     return new mongoose.Types.ObjectId(id);
//   } catch (err) {
//     return null;
//   }
// };

// // GET: Count completed donations
// router.get('/count', async (req, res) => {
//   try {
//     const count = await Donation.countDocuments({ status: 'completed' });
//     res.json({ success: true, count });
//   } catch (error) {
//     console.error('Error fetching donation count:', error);
//     res.status(500).json({ success: false, error: `Server error: ${error.message}` });
//   }
// });

// // GET: Count distinct donors by phone
// router.get('/donors/count', async (req, res) => {
//   try {
//     const count = await Donation.distinct('phone').then(donors => donors.length);
//     res.json({ success: true, count });
//   } catch (error) {
//     console.error('Error fetching donors count:', error);
//     res.status(500).json({ success: false, error: `Server error: ${error.message}` });
//   }
// });

// // Create new donation (immediate payment)
// router.post('/', async (req, res) => {
//   try {
//     // Verify the request exists
//     const requestExists = await RequestDonate.findById(req.body.requester);
//     if (!requestExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Donation request not found'
//       });
//     }

//     const donation = new Donation({
//       ...req.body,
//       status: 'completed',
//       transactionId: `TXN-${Date.now()}`
//     });
    
//     await donation.save();

//     await RequestDonate.findByIdAndUpdate(req.body.requester, {
//       $inc: { amountRaised: donation.amount }
//     });

    
//     res.status(201).json({
//       success: true,
//       donation,
//       message: 'Donation processed successfully'
//     });
//   } catch (error) {
//     res.status(400).json({ 
//       success: false,
//       error: error.message 
//     });
//   }
// });

// router.post('/bank', async (req, res) => {
//   try {
//     // Convert fields
//     req.body.amount = Number(req.body.amount);
//     req.body.requester = toObjectId(req.body.requester);
//     req.body.donor = toObjectId(req.body.donor);

//     console.log('Processed request:', req.body);

//     // Validate required fields
//     if (!req.body.requester || !req.body.donor) {
//       return res.status(400).json({
//         success: false,
//         error: 'Requester ID and Donor ID are required'
//       });
//     }

//     // Verify documents exist
//     const [requestExists, donorExists] = await Promise.all([
//       RequestDonate.findById(req.body.requester),
//       User.findById(req.body.donor)
//     ]);

//     if (!requestExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Donation request not found'
//       });
//     }

//     if (!donorExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'Donor not found'
//       });
//     }

//     // Create donation
//     const bankRef = `DN-${Date.now()}`;
//     const donation = new Donation({
//       ...req.body,
//       status: "pending",
//       transactionId: bankRef
//     });

//     await donation.save();

//     res.status(201).json({
//       success: true,
//       message: "Bank transfer initiated. Staff will verify shortly.",
//       transactionId: bankRef,
//       donation
//     });

//   } catch (error) {
//     console.error('Bank donation error:', error);
//     res.status(400).json({ 
//       success: false,
//       error: "Bank processing failed",
//       details: error.message
//     });
//   }
// });
// // Verify transaction
// router.get('/verify', async (req, res) => {
//   try {
//     const { tx_ref } = req.query;
    
//     if (!tx_ref) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Transaction reference is required' 
//       });
//     }

//     const donation = await Donation.findOne({ transactionId: tx_ref });
//     if (!donation) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Transaction not found' 
//       });
//     }

//     res.json({
//       success: true,
//       verified: donation.status === 'completed',
//       donation: {
//         transactionId: donation.transactionId,
//         amount: donation.amount,
//         recipientName: donation.recipientName,
//         paymentMethod: donation.paymentMethod,
//         createdAt: donation.createdAt,
//         status: donation.status
//       }
//     });
//   } catch (error) {
//     console.error('Verification error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Internal server error',
//       details: error.message 
//     });
//   }
// });

// // Get donations for a specific request
// router.get('/', async (req, res) => {
//   try {
//     const { requester } = req.query;
//     if (!requester) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Requester ID is required' 
//       });
//     }

//     const donations = await Donation.find({ requester }).sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       donations,
//       count: donations.length
//     });
//   } catch (error) {
//     console.error('Error fetching donations:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error',
//       details: error.message 
//     });
//   }
// });

// // Get donations by donor (for donor's history)
// // Get donations by donor ID
// router.get('/by-donor', async (req, res) => {
//   console.log('[API] GET /by-donor initiated', {
//     query: req.query,
//     headers: req.headers
//   });

//   try {
//     const { donor } = req.query;
//     console.log('[DEBUG] Raw donor ID from query:', donor);

//     // Validate donor ID exists in query
//     if (!donor) {
//       console.error('[VALIDATION] No donor ID provided');
//       return res.status(400).json({ 
//         success: false,
//         error: 'Donor ID is required',
//         receivedQuery: req.query
//       });
//     }

//     // Validate ObjectId format
//     if (!mongoose.Types.ObjectId.isValid(donor)) {
//       console.error('[VALIDATION] Invalid donor ID format:', donor);
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid donor ID format',
//         receivedId: donor
//       });
//     }

//     const donorId = new mongoose.Types.ObjectId(donor);
//     console.log('[DEBUG] Converted donor ID:', donorId);

//     // Verify donor exists in database
//     console.log('[DEBUG] Checking donor existence in database');
//     const donorExists = await User.exists({ _id: donorId });
    
//     if (!donorExists) {
//       console.error('[VALIDATION] Donor not found in database:', donorId);
//       return res.status(404).json({
//         success: false,
//         error: 'Donor not found',
//         donorId: donorId.toString()
//       });
//     }

//     console.log('[DEBUG] Querying donations for donor:', donorId);
//     const donations = await Donation.find({ donor: donorId })
//       .sort({ createdAt: -1 })
//       .populate('requester', 'name')
//       .lean(); // Convert to plain JS objects

//     console.log('[DEBUG] Found donations:', {
//       count: donations.length,
//       sample: donations.length > 0 ? donations[0] : null
//     });

//     // Log summary statistics
//     const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
//     console.log('[STATS] Donation summary:', {
//       totalDonations: donations.length,
//       totalAmount: totalAmount,
//       avgDonation: donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : 0
//     });

//     res.json({
//       success: true,
//       donations,
//       count: donations.length,
//       totalAmount: totalAmount,
//       metrics: {
//         averageDonation: donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : 0,
//         lastDonationDate: donations.length > 0 ? donations[0].createdAt : null
//       }
//     });

//     console.log('[API] Successfully returned donations');

//   } catch (error) {
//     console.error('[ERROR] Failed to fetch donations:', {
//       error: error.message,
//       stack: error.stack,
//       query: req.query,
//       timestamp: new Date().toISOString()
//     });

//     res.status(500).json({ 
//       success: false,
//       error: 'Server error',
//       details: process.env.NODE_ENV === 'development' ? {
//         message: error.message,
//         stack: error.stack
//       } : undefined,
//       timestamp: new Date().toISOString()
//     });
//   } finally {
//     console.log('[API] /by-donor request completed');
//   }
// });
// module.exports = router;


const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const RequestDonate = require('../models/RequestDonate'); // Import RequestDonate model
const User = require('../models/User');
const mongoose = require('mongoose');

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (err) {
    return null;
  }
};

router.get("/total", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const result = await Donation.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({ success: true, total: result[0]?.total || 0 });
  } catch (error) {
    console.error("Error fetching total donated amount:", error);
    res
      .status(500)
      .json({ success: false, error: `Server error: ${error.message}` });
  }
});

// GET: Count completed donations
router.get('/count', async (req, res) => {
  try {
    const count = await Donation.countDocuments({ status: 'completed' });
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching donation count:', error);
    res.status(500).json({ success: false, error: `Server error: ${error.message}` });
  }
});

// GET: Count distinct donors by phone
router.get('/donors/count', async (req, res) => {
  try {
    const count = await Donation.distinct('phone').then(donors => donors.length);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching donors count:', error);
    res.status(500).json({ success: false, error: `Server error: ${error.message}` });
  }
});

// Create new donation (immediate payment)
router.post('/', async (req, res) => {
  try {
    // Verify the request exists
    const requestExists = await RequestDonate.findById(req.body.requester);
    if (!requestExists) {
      return res.status(404).json({
        success: false,
        error: 'Donation request not found'
      });
    }

    const donation = new Donation({
      ...req.body,
      status: 'completed',
      transactionId: `TXN-${Date.now()}`
    });
    
    await donation.save();

    await RequestDonate.findByIdAndUpdate(req.body.requester, {
      $inc: { amountRaised: donation.amount }
    });

    
    res.status(201).json({
      success: true,
      donation,
      message: 'Donation processed successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

router.post('/bank', async (req, res) => {
  try {
    // Convert fields
    req.body.amount = Number(req.body.amount);
    req.body.requester = toObjectId(req.body.requester);
    req.body.donor = toObjectId(req.body.donor);

    console.log('Processed request:', req.body);

    // Validate required fields
    if (!req.body.requester || !req.body.donor) {
      return res.status(400).json({
        success: false,
        error: 'Requester ID and Donor ID are required'
      });
    }

    // Verify documents exist
    const [requestExists, donorExists] = await Promise.all([
      RequestDonate.findById(req.body.requester),
      User.findById(req.body.donor)
    ]);

    if (!requestExists) {
      return res.status(404).json({
        success: false,
        error: 'Donation request not found'
      });
    }

    if (!donorExists) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }

    // Create donation
    const bankRef = `DN-${Date.now()}`;
    const donation = new Donation({
      ...req.body,
      status: "pending",
      transactionId: bankRef
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: "Bank transfer initiated. Staff will verify shortly.",
      transactionId: bankRef,
      donation
    });

  } catch (error) {
    console.error('Bank donation error:', error);
    res.status(400).json({ 
      success: false,
      error: "Bank processing failed",
      details: error.message
    });
  }
});
// Verify transaction
router.get('/verify', async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    if (!tx_ref) {
      return res.status(400).json({ 
        success: false,
        error: 'Transaction reference is required' 
      });
    }

    const donation = await Donation.findOne({ transactionId: tx_ref });
    if (!donation) {
      return res.status(404).json({ 
        success: false,
        error: 'Transaction not found' 
      });
    }

    res.json({
      success: true,
      verified: donation.status === 'completed',
      donation: {
        transactionId: donation.transactionId,
        amount: donation.amount,
        recipientName: donation.recipientName,
        paymentMethod: donation.paymentMethod,
        createdAt: donation.createdAt,
        status: donation.status
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get donations for a specific request
router.get('/', async (req, res) => {
  try {
    const { requester } = req.query;
    if (!requester) {
      return res.status(400).json({ 
        success: false,
        error: 'Requester ID is required' 
      });
    }

    const donations = await Donation.find({ requester }).sort({ createdAt: -1 });
    res.json({
      success: true,
      donations,
      count: donations.length
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
});

// Get donations by donor (for donor's history)
// Get donations by donor ID
router.get('/by-donor', async (req, res) => {
  console.log('[API] GET /by-donor initiated', {
    query: req.query,
    headers: req.headers
  });

  try {
    const { donor } = req.query;
    console.log('[DEBUG] Raw donor ID from query:', donor);

    // Validate donor ID exists in query
    if (!donor) {
      console.error('[VALIDATION] No donor ID provided');
      return res.status(400).json({ 
        success: false,
        error: 'Donor ID is required',
        receivedQuery: req.query
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(donor)) {
      console.error('[VALIDATION] Invalid donor ID format:', donor);
      return res.status(400).json({
        success: false,
        error: 'Invalid donor ID format',
        receivedId: donor
      });
    }

    const donorId = new mongoose.Types.ObjectId(donor);
    console.log('[DEBUG] Converted donor ID:', donorId);

    // Verify donor exists in database
    console.log('[DEBUG] Checking donor existence in database');
    const donorExists = await User.exists({ _id: donorId });
    
    if (!donorExists) {
      console.error('[VALIDATION] Donor not found in database:', donorId);
      return res.status(404).json({
        success: false,
        error: 'Donor not found',
        donorId: donorId.toString()
      });
    }

    console.log('[DEBUG] Querying donations for donor:', donorId);
    const donations = await Donation.find({ donor: donorId })
      .sort({ createdAt: -1 })
      .populate('requester', 'name')
      .lean(); // Convert to plain JS objects

    console.log('[DEBUG] Found donations:', {
      count: donations.length,
      sample: donations.length > 0 ? donations[0] : null
    });

    // Log summary statistics
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    console.log('[STATS] Donation summary:', {
      totalDonations: donations.length,
      totalAmount: totalAmount,
      avgDonation: donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : 0
    });

    res.json({
      success: true,
      donations,
      count: donations.length,
      totalAmount: totalAmount,
      metrics: {
        averageDonation: donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : 0,
        lastDonationDate: donations.length > 0 ? donations[0].createdAt : null
      }
    });

    console.log('[API] Successfully returned donations');

  } catch (error) {
    console.error('[ERROR] Failed to fetch donations:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined,
      timestamp: new Date().toISOString()
    });
  } finally {
    console.log('[API] /by-donor request completed');
  }
});
module.exports = router;