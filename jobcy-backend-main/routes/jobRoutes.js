const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Import job controllers
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getDashboard,
  getAllJobs,
  applyForJob,
  getUserApplications,
  getJobApplications,
} = require("../controllers/jobController");

// HR routes - for creating/managing jobs
router.post("/create", protect, allowRoles("hr"), createJob);
router.get("/my-jobs", protect, allowRoles("hr"), getMyJobs);
router.put("/:id", protect, allowRoles("hr"), updateJob);
router.delete("/:id", protect, allowRoles("hr"), deleteJob);
router.get("/dashboard", protect, allowRoles("hr"), getDashboard);

// Admin/User routes - for browsing jobs (specific routes must come before generic ones)
router.get("/browse", protect, allowRoles("user", "admin"), getAllJobs);
router.get("/my-applications", protect, allowRoles("user"), getUserApplications);

// Admin route - get applications for a specific job (must come before /:id routes)
router.get("/:jobId/applications", protect, allowRoles("admin", "hr"), getJobApplications);

// User routes - for applying to jobs
router.post("/apply/:jobId", protect, allowRoles("user"), applyForJob);

// Admin route - get all jobs (must be last among GET routes with params)
router.get("/", protect, allowRoles("admin"), getAllJobs);

module.exports = router;
