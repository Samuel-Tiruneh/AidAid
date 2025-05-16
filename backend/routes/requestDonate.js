const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
require("dotenv").config();
const RequestDonate = require("../models/RequestDonate");
const Donation = require("../models/Donation");
const { authenticateUser } = require("../middleware/authMiddleware");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("No file provided for upload");
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(new Error("Cloudinary upload failed: " + error.message));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err.message);
    throw new Error("Error uploading to Cloudinary: " + err.message);
  }
};

// GET: Count fulfilled donation requests
router.get("/request-donate/fulfilled/count", async (req, res) => {
  try {
    const count = await RequestDonate.countDocuments({
      donationStatus: "Completed",
    });
    res.json({ success: true, count });
  } catch (error) {
    console.error("Error fetching fulfilled requests count:", error);
    res
      .status(500)
      .json({ success: false, error: `Server error: ${error.message}` });
  }
});

// POST: Create a new donation request
router.post(
  "/request-donate",
  authenticateUser,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "additionalPhotos", maxCount: 5 },
    { name: "additionalDocuments", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      console.log("🟡 Received body:", req.body);
      console.log("🟡 Received files:", req.files);

      const {
        fullName,
        phoneNumber,
        gender,
        age,
        location,
        category,
        neededAmount,
        durationDays,
        caseDescription,
        story,
        bank,
        accountNumber,
        paymentMethod,
      } = req.body;

      if (
        !fullName ||
        !phoneNumber ||
        !gender ||
        !age ||
        !location ||
        !category ||
        !neededAmount ||
        !caseDescription ||
        !story ||
        !bank ||
        !accountNumber ||
        !paymentMethod
      ) {
        console.warn("⚠️ Missing required fields");
        return res.status(400).json({ error: "Missing required fields." });
      }

      const formData = {
        fullName,
        phoneNumber,
        gender,
        age,
        location,
        category,
        neededAmount,
        durationDays: durationDays || 30,
        caseDescription,
        story,
        bank,
        accountNumber,
        paymentMethod,
        createdBy: req.user.userId,
      };

      console.log("🟡 Starting file uploads...");

      if (req.files.photo && req.files.photo[0]) {
        formData.photo = await uploadToCloudinary(req.files.photo[0]);
      }
      if (req.files.document && req.files.document[0]) {
        formData.document = await uploadToCloudinary(req.files.document[0]);
      }
      if (req.files.video && req.files.video[0]) {
        formData.video = await uploadToCloudinary(req.files.video[0]);
      }
      if (req.files.additionalPhotos) {
        formData.additionalPhotos = await Promise.all(
          req.files.additionalPhotos.map((file) => uploadToCloudinary(file))
        );
      }
      if (req.files.additionalDocuments) {
        formData.additionalDocuments = await Promise.all(
          req.files.additionalDocuments.map((file) => uploadToCloudinary(file))
        );
      }

      console.log("🟢 Uploads complete. Saving to DB...", formData);

      const newRequest = new RequestDonate(formData);
      await newRequest.save();

      res.status(200).json({ message: "Request submitted successfully!" });
    } catch (err) {
      console.error("Error during donation request submission:", err);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
);

// GET: Fetch all donation requests for the authenticated user (requester)
router.get("/my-requests", authenticateUser, async (req, res) => {
  try {
    // Find all requests created by the logged-in user
    const requests = await RequestDonate.find({ createdBy: req.user.userId });

    // For each request, get all donations and total amount raised
    const requestsWithDonations = await Promise.all(
      requests.map(async (request) => {
        const donations = await Donation.find({ requester: request._id });
        const amountRaised = donations.reduce(
          (sum, d) => sum + (d.amount || 0),
          0
        );
        return {
          ...request.toObject(),
          donations,
          amountRaised,
        };
      })
    );

    res.json(requestsWithDonations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while fetching your requests." });
  }
});

// GET: Fetch donation requests with optional filters
router.get("/request-donate", async (req, res) => {
  try {
    // Build a filter object based on query params
    const filter = {};

    if (req.query.donationStatus) {
      filter.donationStatus = req.query.donationStatus;
    }
    if (req.query.requestStatus) {
      filter.requestStatus = req.query.requestStatus;
    }
    if (req.query.isApproved !== undefined) {
      // Convert string to boolean
      filter.isApproved = req.query.isApproved === "true";
    }

    // Find all matching donation requests
    const donationRequests = await RequestDonate.find(filter);

    // For each request, calculate the total donations amount
    const requestsWithAmounts = await Promise.all(
      donationRequests.map(async (request) => {
        // Find all donations for this specific request
        const donations = await Donation.find({ requester: request._id });

        // Calculate the total amount raised
        const amountRaised = donations.reduce(
          (sum, donation) => sum + (donation.amount || 0),
          0
        );

        // Return the request object with the additional amountRaised field
        return {
          ...request.toObject(),
          amountRaised,
        };
      })
    );

    res.json(requestsWithAmounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while fetching donations." });
  }
});

// GET: Fetch donation by ID
router.get("/request-donate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RequestDonate.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    // Get all donations and calculate total
    const donations = await Donation.find({ requester: id }).sort({
      createdAt: -1,
    });
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    // Determine if we should complete the request
    const shouldComplete = totalAmount >= request.neededAmount;
    const newStatus = shouldComplete ? "Completed" : request.donationStatus;

    // Prepare update data
    const updateData = {
      amountRaised: totalAmount,
      donationStatus: newStatus,
    };

    // Only update if either amount or status changed
    if (
      request.amountRaised !== totalAmount ||
      request.donationStatus !== newStatus
    ) {
      await RequestDonate.findByIdAndUpdate(id, updateData);
    }

    // Get the updated request
    const updatedRequest = await RequestDonate.findById(id);

    res.json({
      request: updatedRequest,
      donations,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH: Update donation request status
router.patch("/request-donate/:id/requestStatus", async (req, res) => {
  try {
    const { id } = req.params;
    const { requestStatus, stopTime } = req.body;

    if (
      !requestStatus ||
      !["New", "Approved", "NeedRevise", "Rejected"].includes(requestStatus)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing requestStatus." });
    }

    const updateData = { requestStatus };
    if (requestStatus === "Approved") {
      if (!stopTime) {
        return res
          .status(400)
          .json({ error: "Stop time is required for approval." });
      }
      updateData.isApproved = true;
      updateData.stopTime = new Date(stopTime);
      if (updateData.stopTime <= new Date()) {
        return res
          .status(400)
          .json({ error: "Stop time must be in the future." });
      }
    }

    const donation = await RequestDonate.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!donation) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    res.json({ message: `Request ${requestStatus} successfully`, donation });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH: Update donation status
router.patch("/request-donate/:id/donationStatus", async (req, res) => {
  try {
    const { id } = req.params;
    const { donationStatus, startTime, stopTime } = req.body;

    // Validate donationStatus
    if (
      !donationStatus ||
      !["NotActive", "Active", "Paused", "Completed"].includes(donationStatus)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing donationStatus." });
    }

    // Get the current donation request
    const donationRequest = await RequestDonate.findById(id);
    if (!donationRequest) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    // Calculate current amount raised
    const donations = await Donation.find({ requester: id });
    const amountRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    // Check if amount is fulfilled (with a small buffer for floating point numbers)
    const isAmountFulfilled =
      amountRaised >= donationRequest.neededAmount * 0.999;

    // Prepare update data
    const updateData = { donationStatus };

    // If amount is fulfilled, force status to "Completed"
    if (isAmountFulfilled) {
      updateData.donationStatus = "Completed";
    }
    // Otherwise proceed with requested status
    else if (donationStatus === "Active") {
      if (!startTime || !stopTime) {
        return res.status(400).json({
          error: "Start time and stop time are required for activation.",
        });
      }
      updateData.startTime = new Date(startTime);
      updateData.stopTime = new Date(stopTime);
      if (updateData.startTime >= updateData.stopTime) {
        return res
          .status(400)
          .json({ error: "Stop time must be after start time." });
      }
    }

    // Update the donation request
    const updatedDonation = await RequestDonate.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      message: isAmountFulfilled
        ? "Donation automatically completed as required amount was fulfilled"
        : `Donation status updated to ${updateData.donationStatus}`,
      donation: updatedDonation,
      amountRaised,
      neededAmount: donationRequest.neededAmount,
      isAmountFulfilled,
    });
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Send a message to the requester
router.post("/request-donate/:id/message", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const donation = await RequestDonate.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    donation.messages.push({
      sender: "Admin",
      content,
      sentAt: new Date(),
    });

    await donation.save();

    res.json({ message: "Message sent successfully", donation });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH: Revise a donation request
router.patch(
  "/request-donate/:id/revise",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "additionalPhotos", maxCount: 5 },
    { name: "additionalDocuments", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        fullName,
        phoneNumber,
        gender,
        age,
        location,
        category,
        neededAmount,
        durationDays,
        caseDescription,
        story,
        bank,
        accountNumber,
        paymentMethod,
      } = req.body;

      const donation = await RequestDonate.findById(id);
      if (!donation) {
        return res.status(404).json({ message: "Donation request not found" });
      }

      if (donation.requestStatus !== "NeedRevise") {
        return res
          .status(400)
          .json({ error: "Request is not in NeedRevise status." });
      }

      const updateData = {
        fullName: fullName || donation.fullName,
        phoneNumber: phoneNumber || donation.phoneNumber,
        gender: gender || donation.gender,
        age: age || donation.age,
        location: location || donation.location,
        category: category || donation.category,
        neededAmount: neededAmount || donation.neededAmount,
        durationDays: durationDays || donation.durationDays,
        caseDescription: caseDescription || donation.caseDescription,
        story: story || donation.story,
        bank: bank || donation.bank,
        accountNumber: accountNumber || donation.accountNumber,
        paymentMethod: paymentMethod || donation.paymentMethod,
        requestStatus: "New",
        revisionCount: donation.revisionCount + 1,
        lastRevisedAt: new Date(),
      };

      if (req.files.photo && req.files.photo[0]) {
        updateData.photo = await uploadToCloudinary(req.files.photo[0]);
      }
      if (req.files.document && req.files.document[0]) {
        updateData.document = await uploadToCloudinary(req.files.document[0]);
      }
      if (req.files.video && req.files.video[0]) {
        updateData.video = await uploadToCloudinary(req.files.video[0]);
      }
      if (req.files.additionalPhotos) {
        updateData.additionalPhotos = await Promise.all(
          req.files.additionalPhotos.map((file) => uploadToCloudinary(file))
        );
      }
      if (req.files.additionalDocuments) {
        updateData.additionalDocuments = await Promise.all(
          req.files.additionalDocuments.map((file) => uploadToCloudinary(file))
        );
      }

      const updatedDonation = await RequestDonate.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      res.json({
        message: "Request revised and resubmitted successfully",
        donation: updatedDonation,
      });
    } catch (error) {
      console.error("Error revising donation request:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
