const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserProfile,
  deleteUser,
  getUserProfile,
  getUserStats,
  getUserInterviews,
  getUserApplications,
  getUserNotifications,
  markNotificationAsRead,
} = require("../controllers/userController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/me", protect, allowRoles("user"), getUserProfile);
router.put("/me", protect, allowRoles("user"), updateUserProfile);
router.get("/profile", protect, allowRoles("user"), getUserProfile);
router.put("/profile", protect, allowRoles("user"), updateUserProfile);
router.delete("/profile", protect, allowRoles("user"), deleteUser);
router.get("/stats", protect, allowRoles("user"), getUserStats);

router.get("/list", protect, allowRoles("user", "hr", "admin"), getAllUsers);

router.get("/interviews", protect, allowRoles("user"), getUserInterviews);
router.get("/applications", protect, allowRoles("user"), getUserApplications);
router.get("/notifications", protect, allowRoles("user"), getUserNotifications);
router.put("/notifications/:id/read", protect, allowRoles("user"), markNotificationAsRead);

module.exports = router;
