const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Get current user profile
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user notifications
router.get("/notifications", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("notifications");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.notifications || []);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark notification as read
router.put("/notifications/:id/read", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const notificationId = req.params.id;

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const notification = user.notifications?.find(n => n._id.toString() === notificationId);
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    notification.isRead = true;
    await user.save();

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
