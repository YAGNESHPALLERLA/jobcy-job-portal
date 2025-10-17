const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

console.log("🔄 HR Controller loaded"); // Debug log

// Get HR dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    console.log("📊 HR Dashboard accessed by user:", req.user._id);

    if (req.user.role !== "hr") {
      return res
        .status(403)
        .json({ message: "Access denied. HR role required." });
    }

    const user = await User.findById(req.user._id).select("name company");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get job statistics
    const totalJobs = await Job.countDocuments({ postedBy: req.user._id });
    const activeJobs = await Job.countDocuments({
      postedBy: req.user._id,
      status: "Active",
    });

    // Get application statistics
    const jobIds = await Job.find({ postedBy: req.user._id }).select("_id");
    const jobIdsArray = jobIds.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIdsArray },
    });

    const pendingReviews = await Application.countDocuments({
      jobId: { $in: jobIdsArray },
      status: "Applied",
    });

    console.log(`📈 Dashboard stats for HR ${user.name}:`, {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingReviews,
    });

    res.json({
      name: user.name,
      company: user.company?.name || user.company || "Unknown Company",
      totalJobs,
      activeJobs,
      totalApplications,
      pendingReviews,
    });
  } catch (error) {
    console.error("❌ Error fetching HR dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get HR's jobs
exports.getMyJobs = async (req, res) => {
  try {
    console.log("📝 HR My Jobs accessed by user:", req.user._id);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      postedDate: -1,
    });

    console.log(`📋 Found ${jobs.length} jobs for HR`);

    const formattedJobs = jobs.map((job) => ({
      id: job._id,
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      status: job.status || "Active",
      applicants: job.applicants || 0,
      postedDate: job.postedDate,
      qualifications: job.qualifications || [],
      careerLevel: job.careerLevel,
      experienceRange: job.experienceRange,
      applicationDeadline: job.applicationDeadline,
      department: job.company, // Map company to department for frontend
    }));

    console.log("📤 Sending jobs to HR frontend:", formattedJobs.length > 0 ? formattedJobs[0] : "No jobs");

    res.json(formattedJobs);
  } catch (error) {
    console.error("❌ Error getting HR jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    console.log("🆕 HR Creating job - Request body:", req.body);
    
    const {
      title,
      description,
      company,
      location,
      salary,
      qualifications,
      type,
      careerLevel,
      experienceRange,
      status,
      applicationDeadline,
    } = req.body;

    console.log("🆕 Creating job:", title, "- Career Level:", careerLevel);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Only HR users can post jobs" });
    }

    // Warn if careerLevel is not provided
    if (!careerLevel) {
      console.warn("⚠️ Warning: Career level not provided, using default 'Experienced'");
    }

    const job = new Job({
      postedBy: req.user._id,
      title,
      description,
      company: company || req.user.company?.name || "Unknown Company",
      location,
      salary,
      qualifications: qualifications || [],
      type,
      careerLevel: careerLevel || "Experienced", // Use default if not provided
      experienceRange,
      status: status || "Active",
      postedDate: new Date(),
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
    });

    try {
      console.log("📝 Job object to save:", JSON.stringify(job));
    } catch (e) {
      console.log("📝 Job object to save - couldn't stringify");
    }

    await job.save();

    console.log("✅ Job created successfully:", job._id, "- Saved careerLevel:", job.careerLevel);

    res.status(201).json({
      message: "Job posted successfully",
      job: {
        id: job._id,
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        description: job.description,
        status: job.status,
        careerLevel: job.careerLevel,
        experienceRange: job.experienceRange,
        qualifications: job.qualifications,
        postedDate: job.postedDate,
        applicationDeadline: job.applicationDeadline,
        department: job.company,
      },
    });
  } catch (error) {
    console.error("❌ Error posting job:", error);
    console.error("Error details:", error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors,
        details: error.message
      });
    }
    
    res.status(500).json({ 
      message: "Server error",
      error: error.message,
      details: "Check backend console for more information"
    });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    console.log("✏️ Updating job:", jobId, "- Updates:", updates);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.findOne({ _id: jobId, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Update fields
    Object.assign(job, updates);
    
    try {
      console.log("📝 Job before save:", JSON.stringify(job));
    } catch (e) {
      console.log("📝 Job before save - couldn't stringify");
    }
    
    await job.save();

    console.log("✅ Job updated successfully:", jobId, "- careerLevel:", job.careerLevel);

    // Return complete job data
    const updatedJob = {
      id: job._id,
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      status: job.status,
      applicants: job.applicants || 0,
      postedDate: job.postedDate,
      qualifications: job.qualifications || [],
      careerLevel: job.careerLevel,
      experienceRange: job.experienceRange,
      applicationDeadline: job.applicationDeadline,
      department: job.company,
    };

    res.json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    console.error("❌ Error updating job:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      details: "Check backend console for more information"
    });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    console.log("🗑️ Deleting job:", jobId);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.findOneAndDelete({
      _id: jobId,
      postedBy: req.user._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    console.log("✅ Job deleted successfully:", jobId);

    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get applications for HR's jobs
exports.getApplications = async (req, res) => {
  try {
    console.log("📋 HR Applications accessed by user:", req.user._id);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get all jobs posted by this HR
    const hrJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = hrJobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('userId', 'name email mobile currentLocation skills resume')
      .populate('jobId', 'title company location salary type')
      .sort({ createdAt: -1 });

    console.log(`📋 Found ${applications.length} applications for HR's jobs`);

    res.json(applications);
  } catch (error) {
    console.error("❌ Error getting HR applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    console.log("📝 HR updating application status:", req.params.id);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applicationId = req.params.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Applied", "Under Review", "Interview", "Rejected", "Accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if HR owns this job
    const job = await Job.findById(application.jobId);
    if (!job || job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the old status for notification logic
    const oldStatus = application.status;

    application.status = status;
    await application.save();

    // Create notification for the user if status changed
    if (oldStatus !== status) {
      const user = await User.findById(application.userId);
      if (user) {
        let notificationTitle = "";
        let notificationMessage = "";

        switch (status) {
          case "Under Review":
            notificationTitle = "Application Under Review";
            notificationMessage = `Your application for "${job.title}" is now under review.`;
            break;
          case "Interview":
            notificationTitle = "Interview Scheduled";
            notificationMessage = `Congratulations! You've been selected for an interview for "${job.title}".`;
            break;
          case "Accepted":
            notificationTitle = "Application Accepted";
            notificationMessage = `Great news! Your application for "${job.title}" has been accepted.`;
            break;
          case "Rejected":
            notificationTitle = "Application Update";
            notificationMessage = `We regret to inform you that your application for "${job.title}" was not successful.`;
            break;
          default:
            notificationTitle = "Application Status Updated";
            notificationMessage = `Your application status for "${job.title}" has been updated to ${status}.`;
        }

        user.notifications.push({
          type: "application_status",
          title: notificationTitle,
          message: notificationMessage,
          relatedJob: job._id,
          isRead: false,
        });

        await user.save();
      }
    }

    console.log(`✅ Application ${applicationId} status updated to ${status}`);

    res.json({
      message: "Application status updated successfully",
      application: {
        id: application._id,
        status: application.status
      }
    });
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get resume for a specific application
exports.getResume = async (req, res) => {
  try {
    console.log("📄 HR Resume download for user:", req.params.userId);

    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.userId;

    // First, try to find an application for this user that has resume data
    let application = await Application.findOne({ userId: userId }).select('resume');

    if (application && application.resume && application.resume.data) {
      // Use resume from application (new applications)
      res.set({
        'Content-Type': application.resume.type,
        'Content-Disposition': `attachment; filename="${application.resume.name}"`,
      });
      return res.send(application.resume.data);
    }

    // If no resume in application, try to get it from user profile (existing applications)
    const user = await User.findById(userId).select('resume');
    if (!user || !user.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // For file path resumes, read from file system
    if (typeof user.resume === 'string') {
      const fs = require('fs');
      const path = require('path');

      const resumePath = path.join(__dirname, '..', user.resume);
      console.log('Reading resume from path:', resumePath);

      if (!fs.existsSync(resumePath)) {
        return res.status(404).json({ message: "Resume file not found" });
      }

      const fileBuffer = fs.readFileSync(resumePath);

      // Determine content type based on file extension
      const ext = path.extname(user.resume).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.doc') contentType = 'application/msword';
      else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="resume${ext}"`,
      });

      return res.send(fileBuffer);
    }

    // For buffer-based resumes
    if (user.resume.data) {
      res.set({
        'Content-Type': user.resume.type || 'application/pdf',
        'Content-Disposition': `attachment; filename="${user.resume.name || 'resume.pdf'}"`,
      });
      return res.send(user.resume.data);
    }

    return res.status(404).json({ message: "Resume not found" });
  } catch (error) {
    console.error("❌ Error getting resume:", error);
    res.status(500).json({ message: "Server error" });
  }
};
