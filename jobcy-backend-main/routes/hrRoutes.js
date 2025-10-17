const express = require("express");
const router = express.Router();
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getDashboard,
  getApplications,
  updateApplicationStatus,
  getResume,
} = require("../controllers/hrController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// HR routes - all prefixed with /api/hr in server.js
router.get("/dashboard", protect, allowRoles("hr"), getDashboard);
router.get("/jobs", protect, allowRoles("hr"), getMyJobs);
router.post("/jobs", protect, allowRoles("hr"), createJob);
router.put("/jobs/:id", protect, allowRoles("hr"), updateJob);
router.delete("/jobs/:id", protect, allowRoles("hr"), deleteJob);
router.get("/applications", protect, allowRoles("hr"), getApplications);
router.put("/applications/:id/status", protect, allowRoles("hr"), updateApplicationStatus);
router.get("/resume/:userId", protect, allowRoles("hr"), getResume);

module.exports = router;
