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
  status: {
    type: String,
    enum: ["Active", "Closed", "Draft"],
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
});

module.exports = mongoose.model("Job", jobSchema);
