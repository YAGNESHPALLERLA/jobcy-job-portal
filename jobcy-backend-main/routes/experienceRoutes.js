const express = require("express");
const router = express.Router();
const {
  addExperience,
  getExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect } = require("../middleware/authMiddleware"); // unified protect middleware
const { allowRoles } = require("../middleware/roleMiddleware");

router.post("/experience", protect, allowRoles("user"), addExperience);
router.get("/experience", protect, allowRoles("user"), getExperience);
router.put("/experience/:id", protect, allowRoles("user"), updateExperience);
router.delete("/experience/:id", protect, allowRoles("user"), deleteExperience);

module.exports = router;
