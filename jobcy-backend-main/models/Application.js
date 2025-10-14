const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coverLetter: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Applied", "Under Review", "Interview", "Rejected", "Accepted"],
    default: "Applied",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  resume: {
    data: Buffer,
    name: String,
    type: String,
  },
});

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
