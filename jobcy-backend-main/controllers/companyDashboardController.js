const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// Get company dashboard stats
exports.getCompanyDashboard = async (req, res) => {
  try {
    console.log("📊 Company Dashboard accessed");
    
    // Get company ID from authenticated user
    // Company users login as admin role but we identify them by their Company model _id
    const companyId = req.user._id;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find all HR users associated with this company
    const companyHRs = await User.find({ 
      companyId: companyId,
      role: "hr" 
    }).select("_id name email");

    const hrIds = companyHRs.map(hr => hr._id);

    // Get all jobs posted by HRs of this company
    const totalJobs = await Job.countDocuments({ 
      postedBy: { $in: hrIds } 
    });

    const activeJobs = await Job.countDocuments({ 
      postedBy: { $in: hrIds },
      status: "Active" 
    });

    // Get all job IDs for this company
    const companyJobs = await Job.find({ 
      postedBy: { $in: hrIds } 
    }).select("_id");
    
    const jobIds = companyJobs.map(job => job._id);

    // Get application statistics
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds }
    });

    const pendingApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: "Applied"
    });

    const acceptedApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: "Accepted"
    });

    res.json({
      companyName: company.name,
      companyEmail: company.email,
      totalHRs: companyHRs.length,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      hrUsers: companyHRs,
    });
  } catch (error) {
    console.error("❌ Error fetching company dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all jobs posted by company's HRs
exports.getCompanyJobs = async (req, res) => {
  try {
    console.log("📋 Fetching company jobs");
    
    const companyId = req.user._id;

    // Find all HR users of this company
    const companyHRs = await User.find({ 
      companyId: companyId,
      role: "hr" 
    }).select("_id");

    const hrIds = companyHRs.map(hr => hr._id);

    // Get all jobs posted by these HRs
    const jobs = await Job.find({ 
      postedBy: { $in: hrIds } 
    })
    .populate("postedBy", "name email")
    .sort({ postedDate: -1 });

    const formattedJobs = jobs.map(job => ({
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
      postedBy: job.postedBy.name,
    }));

    console.log(`✅ Found ${formattedJobs.length} jobs for company`);

    res.json(formattedJobs);
  } catch (error) {
    console.error("❌ Error fetching company jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all applications for company's jobs
exports.getCompanyApplications = async (req, res) => {
  try {
    console.log("📋 Fetching company applications");
    
    const companyId = req.user._id;

    // Find all HR users of this company
    const companyHRs = await User.find({ 
      companyId: companyId,
      role: "hr" 
    }).select("_id");

    const hrIds = companyHRs.map(hr => hr._id);

    // Get all jobs posted by these HRs
    const companyJobs = await Job.find({ 
      postedBy: { $in: hrIds } 
    }).select("_id");
    
    const jobIds = companyJobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ 
      jobId: { $in: jobIds } 
    })
    .populate("userId", "name email mobile currentLocation skills resume")
    .populate("jobId", "title company location salary type")
    .populate({
      path: "jobId",
      populate: {
        path: "postedBy",
        select: "name email"
      }
    })
    .sort({ createdAt: -1 });

    console.log(`✅ Found ${applications.length} applications for company`);

    res.json(applications);
  } catch (error) {
    console.error("❌ Error fetching company applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update application status (company can also update)
exports.updateCompanyApplicationStatus = async (req, res) => {
  try {
    const companyId = req.user._id;
    const applicationId = req.params.id;
    const { status } = req.body;

    console.log("📝 Company updating application status:", applicationId);

    // Validate status
    const validStatuses = ["Applied", "Under Review", "Interview", "Rejected", "Accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify this application belongs to a job posted by company's HR
    const job = await Job.findById(application.jobId).populate("postedBy");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the HR who posted this job belongs to this company
    const hr = await User.findById(job.postedBy._id);
    if (!hr || hr.companyId?.toString() !== companyId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update status
    const oldStatus = application.status;
    application.status = status;
    await application.save();

    // Create notification for the user
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

