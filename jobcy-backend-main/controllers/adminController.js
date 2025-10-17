const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

exports.promoteUserToHR = async (req, res) => {
  try {
    // Only admin should access this (use middleware)
    const { userId, company } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "hr")
      return res.status(400).json({ message: "Already HR" });

    user.role = "hr";
    user.company = company; // Accept from admin
    user.createdByAdmin = req.user.id;
    await user.save();

    res.json({ message: "User promoted to HR", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all HR users created by the logged-in admin
exports.getAllHRs = async (req, res) => {
  try {
    const adminId = req.user.id; // assuming admin id is set by auth middleware
    console.log("Fetching HRs for admin:", adminId);

    // For now, get all HRs regardless of who created them (temporary fix)
    const hrs = await User.find({ role: "hr" }).select("-password");
    console.log("Found HRs:", hrs.length);

    // Format the HR data to match frontend expectations
    const formattedHrs = hrs.map(hr => ({
      _id: hr._id,
      name: hr.name,
      email: hr.email,
      company: hr.company,
      companyId: hr.companyId, // Include companyId for filtering
      companySize: hr.company?.companySize || "",
      industry: hr.company?.industry || "",
      website: hr.company?.website || "",
      phone: hr.mobile || "",
      address: hr.company?.address || "",
      status: hr.status || "Active",
      createdDate: hr.createdAt
    }));

    console.log("Formatted HRs:", formattedHrs);
    res.json({ hrs: formattedHrs });
  } catch (error) {
    console.error("Error fetching HRs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update HR user by ID
exports.updateHR = async (req, res) => {
  try {
    const hrId = req.params.id;
    const { name, email, company } = req.body;

    const hr = await User.findById(hrId);
    if (!hr || hr.role !== "hr") {
      return res.status(404).json({ message: "HR user not found" });
    }

    hr.name = name || hr.name;
    hr.email = email || hr.email;
    hr.company = company || hr.company;

    await hr.save();

    res.json({ message: "HR user updated", hr });
  } catch (error) {
    console.error("Error updating HR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete HR user by ID
exports.deleteHR = async (req, res) => {
  try {
    const hrId = req.params.id;
    const hr = await User.findById(hrId);
    if (!hr || hr.role !== "hr") {
      return res.status(404).json({ message: "HR user not found" });
    }

    await User.findByIdAndDelete(hrId);
    res.json({ message: "HR user deleted" });
  } catch (error) {
    console.error("Error deleting HR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// adminController.js
exports.getDashboardStats = async (req, res) => {
  try {
    const totalHRs = await User.countDocuments({ role: "hr" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "Active" });

    res.json({ totalHRs, totalJobs, totalApplications, activeJobs });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Less than an hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

exports.getRecentActivity = async (req, res) => {
  try {
    // Fetch recent HR registrations
    const recentHRs = await User.find({ role: 'hr' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name company createdAt');

    // Fetch recent job postings
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title company createdAt');

    // Create activity objects for HRs
    const hrActivities = recentHRs.map(hr => ({
      id: hr._id,
      type: 'hr_joined',
      message: `${hr.company?.name || hr.name} HR registered`,
      time: getTimeAgo(hr.createdAt),
      createdAt: hr.createdAt,
    }));

    // Create activity objects for jobs
    const jobActivities = recentJobs.map(job => ({
      id: job._id,
      type: 'job_posted',
      message: `${job.title} position posted`,
      time: getTimeAgo(job.createdAt),
      createdAt: job.createdAt,
    }));

    // Combine and sort by most recent
    const allActivities = [...hrActivities, ...jobActivities]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10); // Limit to top 10 activities

    // Remove createdAt from response
    const responseActivities = allActivities.map(({ createdAt, ...rest }) => rest);

    res.json(responseActivities);
  } catch (err) {
    console.error("Error fetching recent activity:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
