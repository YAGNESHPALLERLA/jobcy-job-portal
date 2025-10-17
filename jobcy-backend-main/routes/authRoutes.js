const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  registerCompany,
  registerHR,
  loginUserUnified,
} = require("../controllers/authController");

// Optional middlewares for protected routes
const { protect, allowRoles } = require("../middleware/authMiddleware");

/**
 * ========================================================
 * AUTHENTICATION ROUTES
 * ========================================================
 * These routes handle registration and login for:
 * - Users (job seekers)
 * - Companies (admins)
 * - HRs (human resources)
 * - Unified login for all roles
 */

// ---------------- USER ROUTES ----------------

// Register a new user
// Frontend: /user/auth/signup
// Backend:  POST /api/auth/user/register
router.post("/user/register", registerUser);

// User login (can also use unified login below)
// Frontend: /user/auth/login
// Backend:  POST /api/auth/user/login
router.post("/user/login", loginUserUnified);

// ---------------- COMPANY (ADMIN) ROUTES ----------------

// Register a new company (admin account)
// Frontend: /admin/auth/signup
// Backend:  POST /api/auth/company/register
router.post("/company/register", registerCompany);

// Admin login (can also use unified login below)
// Frontend: /admin/auth/login
// Backend:  POST /api/auth/company/login or /api/auth/login
router.post("/company/login", loginUserUnified);

// ---------------- HR ROUTES ----------------

// Register HR (optional — can be created by admin or self)
// Frontend: /hr/auth/signup
// Backend:  POST /api/auth/hr/register
router.post("/hr/register", registerHR);

// HR login (also handled by unified login)
// Frontend: /hr/auth/login
// Backend:  POST /api/auth/hr/login or /api/auth/login
router.post("/hr/login", loginUserUnified);

// ---------------- UNIFIED LOGIN ----------------
// This allows all roles (user, HR, admin) to log in via one endpoint
// Frontend: any login form
// Backend:  POST /api/auth/login
router.post("/login", loginUserUnified);

/**
 * ========================================================
 * ADMIN-ONLY ACTIONS (OPTIONAL)
 * ========================================================
 * These routes require authentication and specific roles.
 * Uncomment these if you implement role-based access.
 */

// Example: Admin registers new HRs directly
// router.post(
//   "/admin/register-hr",
//   protect,
//   allowRoles("admin"),
//   registerHR
// );

module.exports = router;
