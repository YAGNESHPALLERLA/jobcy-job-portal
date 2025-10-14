const Experience = require("../models/Experience");

// Add new experience record
exports.addExperience = async (req, res) => {
  try {
    const expData = { ...req.body, user: req.user._id };
    const experience = new Experience(expData);
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    console.error("Add experience error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all experience records for the user
exports.getExperience = async (req, res) => {
  try {
    const experience = await Experience.find({ user: req.user._id });
    res.json(experience);
  } catch (error) {
    console.error("Get experience error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an experience record by ID
exports.updateExperience = async (req, res) => {
  try {
    const expId = req.params.id;
    const experience = await Experience.findOneAndUpdate(
      { _id: expId, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!experience)
      return res.status(404).json({ message: "Experience record not found" });
    res.json(experience);
  } catch (error) {
    console.error("Update experience error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an experience record by ID
exports.deleteExperience = async (req, res) => {
  try {
    const expId = req.params.id;
    const experience = await Experience.findOneAndDelete({
      _id: expId,
      user: req.user._id,
    });
    if (!experience)
      return res.status(404).json({ message: "Experience record not found" });
    res.json({ message: "Experience record deleted" });
  } catch (error) {
    console.error("Delete experience error", error);
    res.status(500).json({ message: "Server error" });
  }
};
