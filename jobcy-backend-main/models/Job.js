const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
    required: true,
  },
  qualifications: [String],
  careerLevel: {
    type: String,
    enum: ["Fresher", "Experienced"],
    required: false,
    default: "Experienced", // Default for existing jobs
  },
  experienceRange: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Active", "Closed", "Draft", "Paused"],
    default: "Active",
  },
  applicants: {
    type: Number,
    default: 0,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  applicationDeadline: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Job", jobSchema);
