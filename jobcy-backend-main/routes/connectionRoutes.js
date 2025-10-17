const express = require("express");
const router = express.Router();
const {
  sendConnectionRequest,
  getReceivedRequests,
  getSentRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getUserConnections,
} = require("../controllers/connectionController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Send connection request
router.post("/send", protect, allowRoles("user", "hr", "admin"), sendConnectionRequest);

// Get received connection requests
router.get("/received", protect, allowRoles("user", "hr", "admin"), getReceivedRequests);

// Get sent connection requests
router.get("/sent", protect, allowRoles("user", "hr", "admin"), getSentRequests);

// Accept connection request
router.put("/:requestId/accept", protect, allowRoles("user", "hr", "admin"), acceptConnectionRequest);

// Reject connection request
router.put("/:requestId/reject", protect, allowRoles("user", "hr", "admin"), rejectConnectionRequest);

// Get user connections
router.get("/connections", protect, allowRoles("user", "hr", "admin"), getUserConnections);

module.exports = router;