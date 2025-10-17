const express = require("express");
const router = express.Router();
const {
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
} = require("../controllers/companyController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// All routes require admin authentication
router.use(protect);
router.use(allowRoles("admin"));

// Company routes
router.get("/stats", getCompanyStats);
router.get("/", getAllCompanies);
router.get("/:id", getCompany);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;

