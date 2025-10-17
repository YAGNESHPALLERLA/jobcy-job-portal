const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      email,
      password,
      careerStatus,
      title,
      bio,
      skills,
      professionalRole,
      currentLocation,
      currentCTC,
      company,
      languages,
      education,
      experienceList,
      projects,
      personalDetails,
      dob,
      gender,
      category,
      maritalStatus,
      nationality,
    } = req.body;

    console.log("📝 Updating user profile with data:", {
      name,
      email: email ? "***" : undefined,
      skills: skills?.length,
      languages: languages?.length,
      education: education?.length,
      experienceList: experienceList?.length,
      projects: projects?.length,
      personalDetails: personalDetails?.length,
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (careerStatus) user.careerStatus = careerStatus;
    if (title) user.title = title;
    if (bio) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (professionalRole) user.professionalRole = professionalRole;
    if (currentLocation) user.currentLocation = currentLocation;
    if (currentCTC) user.currentCTC = currentCTC;
    if (company) user.company = company;
    if (languages !== undefined) user.languages = languages;
    if (education !== undefined) user.education = education;
    if (experienceList !== undefined) user.experienceList = experienceList;
    if (projects !== undefined) user.projects = projects;
    if (personalDetails !== undefined) user.personalDetails = personalDetails;

    // Handle individual personal details fields
    if (dob !== undefined || gender !== undefined || category !== undefined || maritalStatus !== undefined || nationality !== undefined) {
      if (!user.personalDetails || user.personalDetails.length === 0) {
        user.personalDetails = [{}];
      }
      if (dob && dob !== "") user.personalDetails[0].dob = dob;
      if (gender && gender !== "") user.personalDetails[0].gender = gender;
      if (category && category !== "") user.personalDetails[0].category = category;
      if (maritalStatus && maritalStatus !== "") user.personalDetails[0].maritalStatus = maritalStatus;
      if (nationality && nationality !== "") user.personalDetails[0].nationality = nationality;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    console.log("✅ User profile saved successfully");
    console.log("📊 Saved data counts:", {
      skills: user.skills?.length || 0,
      languages: user.languages?.length || 0,
      education: user.education?.length || 0,
      experienceList: user.experienceList?.length || 0,
      projects: user.projects?.length || 0,
      personalDetails: user.personalDetails?.length || 0,
    });

    // Return complete user profile data
    res.json({
      message: "Profile updated successfully",
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      professionalRole: user.professionalRole,
      title: user.title,
      currentLocation: user.currentLocation,
      currentCTC: user.currentCTC,
      bio: user.bio,
      skills: user.skills || [],
      languages: user.languages || [],
      education: user.education || [],
      projects: user.projects || [],
      experienceList: user.experienceList || [],
      personalDetails: user.personalDetails || [],
      company: user.company,
      careerStatus: user.careerStatus,
      profileCompletion: user.profileCompletion,
      connections: user.connections,
      resume: user.resume,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user job application stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate counts of applications by status for the user
    const stats = await Application.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize default stats
    const response = {
      totalApplications: 0,
      underReview: 0,
      interviews: 0,
      offers: 0,
    };

    // Map aggregation results to response keys
    stats.forEach((item) => {
      response.totalApplications += item.count;
      const status = item._id.toLowerCase();
      if (status === "under review") response.underReview = item.count;
      else if (status === "interview scheduled" || status === "interview")
        response.interviews = item.count;
      else if (status === "accepted" || status === "offer")
        response.offers = item.count;
      // You can add more mappings for other statuses if needed
    });

    res.json(response);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all normal users for listing/search
exports.getAllUsers = async (req, res) => {
  try {
    // Optionally, add search/filtering here with query params

    const users = await User.find({ role: "user" }).select(
      "-password -createdByAdmin"
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users list:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// In userController.js
exports.getUserInterviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const interviews = await Interview.find({ candidate: userId });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('notifications');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Sort notifications by creation date (newest first)
    const notifications = user.notifications.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await user.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's applied jobs
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ userId: userId })
      .populate({
        path: "jobId",
        populate: {
          path: "postedBy",
          select: "name company",
        },
      })
      .sort({ appliedDate: -1 });

    const formattedApplications = applications.map((app) => {
      let companyName = "Unknown Company";
      if (app.jobId && app.jobId.company) {
        companyName = app.jobId.company;
      } else if (
        app.jobId &&
        app.jobId.postedBy &&
        app.jobId.postedBy.company
      ) {
        companyName =
          typeof app.jobId.postedBy.company === "string"
            ? app.jobId.postedBy.company
            : app.jobId.postedBy.company.name;
      }

      return {
        id: app._id,
        jobId: app.jobId?._id,
        title: app.jobId?.title,
        company: companyName,
        location: app.jobId?.location,
        salary: app.jobId?.salary,
        status: app.status,
        appliedDate: app.appliedDate,
        type: app.jobId?.type,
      };
    });

    res.json(formattedApplications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
