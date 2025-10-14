const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  grade: String,
});

module.exports = mongoose.model("Education", EducationSchema);
