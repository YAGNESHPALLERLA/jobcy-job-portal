const express = require("express");
const router = express.Router();
const {
  getCompanyDashboard,
  getCompanyJobs,
  getCompanyApplications,
  updateCompanyApplicationStatus,
} = require("../controllers/companyDashboardController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
// Company users login with their Company credentials (role: admin)
// But we use their Company _id to filter data

router.get("/dashboard", protect, getCompanyDashboard);
router.get("/jobs", protect, getCompanyJobs);
router.get("/applications", protect, getCompanyApplications);
router.put("/applications/:id/status", protect, updateCompanyApplicationStatus);

module.exports = router;

