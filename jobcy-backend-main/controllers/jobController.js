const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// HR: Create a new job post
exports.createJob = async (req, res) => {
  try {
    console.log("Received job creation request body:", req.body);
    
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
    } = req.body;

    // Check if user has HR role
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Only HR users can post jobs" });
    }

    console.log("✅ Creating job with received data:", {
      postedBy: req.user._id,
      title,
      description,
      company,
      location,
      salary,
      qualifications: qualifications || [],
      type,
      careerLevel,
      experienceRange,
      postedDate: new Date(),
    });

    console.log("🔍 Career Level value:", careerLevel);
    console.log("🔍 Experience Range value:", experienceRange);

    // Validate required fields
    if (!title || !description || !location || !type || !careerLevel) {
      console.error("❌ Validation failed - missing fields:", {
        title: !title,
        description: !description,
        location: !location,
        type: !type,
        careerLevel: !careerLevel
      });
      return res.status(400).json({ 
        message: "Missing required fields",
        missingFields: {
          title: !title,
          description: !description,
          location: !location,
          type: !type,
          careerLevel: !careerLevel
        }
      });
    }

    const jobData = {
      postedBy: req.user._id,
      title,
      description,
      company,
      location,
      salary,
      qualifications: qualifications || [],
      type,
      careerLevel,
      experienceRange,
      postedDate: new Date(),
    };

    console.log("📝 Job data to be saved:", jobData);

    const job = new Job(jobData);

    console.log("📝 Job object before save:", job.toObject());
    
    await job.save();
    
    console.log("✅ Job saved successfully. Saved data:", job.toObject());

    // Populate the postedBy field for response
    await job.populate("postedBy", "name email");

    res.status(201).json({
      message: "Job posted successfully",
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        description: job.description,
        qualifications: job.qualifications,
        careerLevel: job.careerLevel,
        experienceRange: job.experienceRange,
        postedBy: job.postedBy.name,
        postedDate: job.postedDate,
      },
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// HR: Get all jobs posted by logged-in HR
exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      postedDate: -1,
    });
    res.json(jobs);
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// USER: Get all jobs for users to browse
exports.getAllJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log("Fetching jobs for user:", userId, "role:", userRole);

    // Build filter object - show all jobs for admin, only active for users
    let filter = {};
    if (userRole !== "admin") {
      filter.status = "Active";
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Add location filter
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Add job type filter
    if (type) {
      filter.type = type;
    }

    // Get all jobs with poster info
    const jobs = await Job.find(filter)
      .populate("postedBy", "name email company")
      .sort({ postedDate: -1 });

    console.log(`Found ${jobs.length} jobs in database`);

    // Check if user has already applied to each job
    const jobsWithApplicationStatus = await Promise.all(
      jobs.map(async (job) => {
        const application = await Application.findOne({
          jobId: job._id,
          userId: userId,
        });

        // Get company name
        let companyName = job.company;
        if (!companyName && job.postedBy && job.postedBy.company) {
          companyName =
            typeof job.postedBy.company === "string"
              ? job.postedBy.company
              : job.postedBy.company.name;
        }

        return {
          id: job._id,
          _id: job._id,
          title: job.title,
          company: companyName || "Unknown Company",
          location: job.location,
          salary: job.salary,
          type: job.type,
          description: job.description,
          qualifications: job.qualifications,
          careerLevel: job.careerLevel,
          experienceRange: job.experienceRange,
          posted: job.postedDate,
          applicants: job.applicants || 0,
          status: job.status,
          hasApplied: !!application,
          applicationStatus: application?.status || null,
          postedBy: userRole === "admin" ? job.postedBy?._id : job.postedBy?.name || "Unknown",
          applicationDeadline: job.applicationDeadline,
        };
      })
    );

    console.log(`✅ Sending ${jobsWithApplicationStatus.length} jobs to user`);
    res.json(jobsWithApplicationStatus);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// USER: Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;
    const { coverLetter } = req.body;

    console.log(`User ${userId} applying for job ${jobId}`);

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if job is active
    if (job.status !== "Active") {
      return res.status(400).json({ message: "This job is no longer active" });
    }

    // Prevent users from applying to their own jobs (if they're HR)
    if (job.postedBy && job.postedBy.equals(userId)) {
      return res
        .status(400)
        .json({ message: "You cannot apply to your own job posting" });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId: jobId,
      userId: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        applicationId: existingApplication._id,
      });
    }

    // Get user's resume to copy to application
    const user = await User.findById(userId).select('resume');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new application
    const application = new Application({
      jobId: jobId,
      userId: userId,
      coverLetter: coverLetter || "",
      status: "Applied",
      appliedDate: new Date(),
      resume: user.resume || null, // Copy resume from user
    });

    await application.save();

    // Increment applicants count on job
    job.applicants = (job.applicants || 0) + 1;
    await job.save();

    console.log(`✅ User ${userId} successfully applied for job ${jobId}`);

    res.status(201).json({
      message: "Application submitted successfully",
      application: {
        id: application._id,
        status: application.status,
        appliedDate: application.appliedDate,
      },
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    // Log the full error for debugging
    console.error("Full error details:", error.stack);
    res.status(500).json({
      message: "Server error while applying for job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// USER: Get user's applied jobs
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

// HR: Get dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.user._id).select("name company");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalJobs = await Job.countDocuments({ postedBy: req.user._id });
    const activeJobs = await Job.countDocuments({
      postedBy: req.user._id,
      status: "Active",
    });

    const totalApplications = await Application.countDocuments({
      jobId: { $in: await Job.find({ postedBy: req.user._id }).select("_id") },
    });

    const pendingReviews = await Application.countDocuments({
      jobId: { $in: await Job.find({ postedBy: req.user._id }).select("_id") },
      status: "Applied",
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
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// HR: Update a job post by ID
exports.updateJob = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findOne({ _id: jobId, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    Object.assign(job, updates);
    await job.save();

    res.json({ message: "Job updated", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// HR: Delete a job post by ID
exports.deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobId = req.params.id;

    const job = await Job.findOneAndDelete({
      _id: jobId,
      postedBy: req.user._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get applications for a specific job (Admin access)
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate("userId", "name email mobile currentLocation skills resume")
      .populate("jobId", "title company location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
