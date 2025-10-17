const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markAsRead
} = require("../controllers/chatController");

// All routes require authentication
router.use(protect);

// Get or create a chat with a specific user
router.get("/chat/:userId", getOrCreateChat);

// Get all chats for the current user
router.get("/chats", getUserChats);

// Get messages for a specific chat
router.get("/messages/:chatId", getChatMessages);

// Send a message
router.post("/send", sendMessage);

// Mark messages as read
router.put("/read/:chatId", markAsRead);

module.exports = router;

