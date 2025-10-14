const express = require("express");
const {
  registerUser,
  loginUserUnified, // unified login for all roles
  registerCompany,
  // remove separate loginCompany if unified used,
  registerHR, // optional if you want to add HR registration here
} = require("../controllers/authController");

const router = express.Router();

// User registration route
router.post("/users/register", registerUser);
router.post("/users/login", loginUserUnified);

// Unified login route for users, HRs, admins
router.post("/login", loginUserUnified);

// Optional: Admin registration (company)
router.post("/companies/register", registerCompany);

// Optionally, if separate admin login remains, keep or remove:
// router.post("/companies/login", loginCompany);

// Optional: Admin-only route to register HR users
// router.post("/admin/register-hr", protect, allowRoles("admin"), registerHR);

module.exports = router;
