const express = require("express");
const router = express.Router();
const {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const { protect, allowRoles } = require("../middleware/authMiddleware"); // unified protect middleware

router.post("/", protect, allowRoles("user"), addEducation);
router.get("/", protect, allowRoles("user"), getEducation);
router.put("/:id", protect, allowRoles("user"), updateEducation);
router.delete("/:id", protect, allowRoles("user"), deleteEducation);

module.exports = router;
