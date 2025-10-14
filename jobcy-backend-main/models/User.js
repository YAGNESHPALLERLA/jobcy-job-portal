const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "hr", "admin"],
      default: "user",
    },
    professionalRole: {
      type: String,
      trim: true,
      // e.g., "UI Developer", "Full Stack Engineer"
    },
    currentLocation: {
      type: String,
      trim: true,
      // e.g., "Hyderabad, India"
    },
    currentCTC: {
      type: Number,
      min: 0,
      // e.g., 850000  (in INR per annum)
    },
    careerStatus: {
      type: String,
      enum: ["fresher", "experienced"],
      required: false,
    },
    company: {
      name: String,
      location: String,
      description: String,
      website: String,
    },
    title: String,
    bio: String,
    skills: [String],
    languages: [
      {
        name: String,
        proficiency: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        grade: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    profileCompletion: {
      type: Number,
      default: 0,
    },

    // optionally other personal details

    personalDetails: [
      {
        gender: String,
        category: String,
        maritalStatus: String,
        nationality: String,
      },
    ],
    resume: {
      type: String,
      default: null,
    },
    notifications: [
      {
        type: {
          type: String,
          enum: ["application_status", "interview_scheduled", "job_update"],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        relatedJob: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
