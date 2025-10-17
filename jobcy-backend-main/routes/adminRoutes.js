const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const {
  adminLogin,
  createHR,
  getAllHRs,
  updateHR,
  deleteHR,
  getDashboardStats,
  getRecentActivity,
  getAllApplications,
} = require("../controllers/adminController");
const { protect, allowRoles } = require("../middleware/authMiddleware"); // unified middleware

router.post(
  "/admin/register-hr",
  protect,
  allowRoles("admin"),
  authController.registerHR
);
router.post(
  "/admin/promote-user",
  protect,
  allowRoles("admin"),
  adminController.promoteUserToHR
);

// Protected admin routes (using unified protect and role check)
router.post(
  "/admin/create-hr",
  protect,
  allowRoles("admin"),
  authController.registerHR
);

router.get("/admin/hrs", protect, allowRoles("admin"), getAllHRs);
router.put("/admin/hrs/:id", protect, allowRoles("admin"), updateHR);
router.delete("/admin/hrs/:id", protect, allowRoles("admin"), deleteHR);

// Dashboard routes
router.get("/admin/stats", protect, allowRoles("admin"), getDashboardStats);
router.get("/admin/activity", protect, allowRoles("admin"), getRecentActivity);
router.get("/admin/applications", protect, allowRoles("admin"), getAllApplications);

module.exports = router;
