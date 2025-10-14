const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  location: String,
  description: String,
});

module.exports = mongoose.model("Experience", ExperienceSchema);
