const Education = require("../models/Education");

exports.addEducation = async (req, res) => {
  try {
    const eduData = { ...req.body, user: req.user._id };
    const education = new Education(eduData);
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    console.error("Add education error", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEducation = async (req, res) => {
  try {
    const education = await Education.find({ user: req.user._id });
    res.json(education);
  } catch (error) {
    console.error("Get education error", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const eduId = req.params.id;
    const education = await Education.findOneAndUpdate(
      { _id: eduId, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!education)
      return res.status(404).json({ message: "Education record not found" });
    res.json(education);
  } catch (error) {
    console.error("Update education error", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const eduId = req.params.id;
    const education = await Education.findOneAndDelete({
      _id: eduId,
      user: req.user._id,
    });
    if (!education)
      return res.status(404).json({ message: "Education record not found" });
    res.json({ message: "Education record deleted" });
  } catch (error) {
    console.error("Delete education error", error);
    res.status(500).json({ message: "Server error" });
  }
};
