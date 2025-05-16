const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();
const cloudinary = require("../cloudinary");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body; // Add role here

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Include role in user creation
    const user = await User.create({ 
      username, 
      email, 
      password,
      role: role || 'Donor' // Default to Donor if not provided
    });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin, 
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: {
        _id: user._id, // ✅ Important change here
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/update-profile/:id", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { username, email, phoneNumber, location } = req.body; 

   
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber; 
    if (location) updateFields.location = location; 

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
    console.log(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/update-password/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Debug password comparison
    console.log("\n--- PASSWORD UPDATE DEBUG ---");
    console.log("User:", user.email);
    console.log("Entered old password:", oldPassword);
    console.log("Stored hash:", user.password);

    // Use the model's matchPassword method
    const isMatch = await user.matchPassword(oldPassword);
    console.log("Comparison result:", isMatch);

    if (!isMatch) {
      console.log("Old password incorrect");
      return res.status(400).json({ 
        message: "Incorrect old password",
        code: "INCORRECT_PASSWORD" 
      });
    }

    // Directly assign new password - let pre-save hook handle hashing
    user.password = newPassword;
    await user.save();

    console.log("Password updated successfully");
    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/upload-profile-picture/:id", async (req, res) => {
  try {
    const { image } = req.body; 
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "profile-pictures",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});  // <-- Added this closing parenthesis here




module.exports = router;
