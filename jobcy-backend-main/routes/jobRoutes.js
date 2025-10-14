const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

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
} = require("../controllers/jobController");

// HR routes - for creating/managing jobs
router.post("/create", protect, allowRoles("hr"), createJob);
router.get("/my-jobs", protect, allowRoles("hr"), getMyJobs);
router.put("/:id", protect, allowRoles("hr"), updateJob);
router.delete("/:id", protect, allowRoles("hr"), deleteJob);
router.get("/dashboard", protect, allowRoles("hr"), getDashboard);

// User routes - for browsing and applying to jobs
router.get("/browse", protect, allowRoles("user", "admin"), getAllJobs);
router.post("/apply/:jobId", protect, allowRoles("user"), applyForJob);
router.get(
  "/my-applications",
  protect,
  allowRoles("user"),
  getUserApplications
);

module.exports = router;
