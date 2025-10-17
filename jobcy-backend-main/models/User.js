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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
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
        id: String,
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String,
        grade: String,
      },
    ],
    experienceList: [
      {
        id: String,
        position: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
        technologies: [String],
      },
    ],
    profileCompletion: {
      type: Number,
      default: 0,
    },

    // optionally other personal details

    personalDetails: [
      {
        dob: Date,
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
