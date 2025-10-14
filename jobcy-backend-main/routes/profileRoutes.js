// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, userController.getUserProfile);
router.put("/", protect, userController.updateUserProfile);

module.exports = router;