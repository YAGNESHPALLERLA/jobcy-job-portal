const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Ensure uploads/resumes directory exists
const resumesDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Upload resume route
router.post("/resume", protect, allowRoles("user", "hr", "admin"), upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;

    // Store resume filename in database
    await User.findByIdAndUpdate(userId, {
      resume: req.file.filename,
    });

    res.json({
      message: "Resume uploaded successfully",
      fileName: req.file.filename,
      filePath: `/uploads/resumes/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload", error: error.message });
  }
});

module.exports = router;