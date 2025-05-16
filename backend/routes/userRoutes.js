const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Your Mongoose User model

// GET all users (for admin panel) with optional role filtering
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;  // Destructure role from query params
    
    let users;
    if (role) {
      // If role is provided, filter users by role
      users = await User.find({ role });
    } else {
      // If no role is provided, return all users
      users = await User.find();
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PUT /api/users/:id/status
router.patch('/:id/status', async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body; // "active" or "banned"

  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
  res.json(user);
});


// POST - Create a new user (admin add user)
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: "Failed to create user" });
  }
});


// PUT - Update a user's profile picture
router.put("/:id/profilePicture", async (req, res) => {
   console.log("Updating profile picture for user ID:", req.params.id); // Log the user ID
  try {
    const { profilePicture } = req.body;  // Get the URL of the new profile picture from the request body
    const userId = req.params.id;         // Get user ID from the URL

    // Find the user by ID and update their profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },  // Update the user's profile picture field
      { new: true }        // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user info back as a response
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});

// PUT - Update a user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated user
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Failed to update user" });
  }
});

// DELETE - Remove a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;