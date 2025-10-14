const News = require("../models/News")

exports.createNews = async (req, res) => {
  try {
    // Only admins can create news
    const news = new News({
      ...req.body,
      companyId: req.user.id,
    })
    await news.save()
    res.status(201).json(news)
  } catch (error) {
    console.error("Error creating news:", error)
    res.status(500).json({ error: "Error creating news" })
  }
}

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 })
    res.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    res.status(500).json({ error: "Error fetching news" })
  }
}

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (!news) {
      return res.status(404).json({ error: "News not found" })
    }
    res.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    res.status(500).json({ error: "Error fetching news" })
  }
}

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)

    if (!news) {
      return res.status(404).json({ error: "News not found" })
    }

    // Check if the user is the owner of the news
    if (news.companyId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this news" })
    }

    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json(updatedNews)
  } catch (error) {
    console.error("Error updating news:", error)
    res.status(500).json({ error: "Error updating news" })
  }
}

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)

    if (!news) {
      return res.status(404).json({ error: "News not found" })
    }

    // Check if the user is the owner of the news
    if (news.companyId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this news" })
    }

    await News.findByIdAndDelete(req.params.id)
    res.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("Error deleting news:", error)
    res.status(500).json({ error: "Error deleting news" })
  }
}

