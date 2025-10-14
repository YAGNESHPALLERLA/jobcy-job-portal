const express = require("express")
const { createNews, getAllNews, getNewsById, updateNews, deleteNews } = require("../controllers/newsController")
const { authenticate, isAdmin } = require("../middleware/authMiddleware")

const router = express.Router()

// Public routes
router.get("/", getAllNews)
router.get("/:id", getNewsById)

// Protected routes (admin only)
router.post("/", authenticate, isAdmin, createNews)
router.put("/:id", authenticate, isAdmin, updateNews)
router.delete("/:id", authenticate, isAdmin, deleteNews)

module.exports = router

