"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Calendar,
  Filter,
  Pause,
  Play,
  AlertCircle,
  FileText,
  ChevronDown,
  Target,
  // Activity,
  Zap,
  Globe,
  Save,
  // TrendingUp,
  UserCheck,
  // XCircle,
  // BarChart3,
  RefreshCw,
  Archive,
} from "lucide-react";

export default function JobManagement() {
  const [currentView, setCurrentView] = useState("list");
  interface Job {
  id?: string;
  _id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryMin?:string;
  salaryMax?:string;
  currency?: string;
  description?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  experienceLevel?: string;
  applicationDeadline?: string;
  status: "Active" | "Paused" | "Closed" | "Draft";
  applications?: number;
  views?: number;
  postedDate?: string;
  updatedAt?: string;
  skills?: string | string[];

}
  const [jobs, setJobs] = useState<Job[]>([]);  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [successMessage, setSuccessMessage] = useState("");
  type FormData = {
  title: string;
  department: string;
  location: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  experienceLevel: string;
  skills: string;
  applicationDeadline: string;
  status: string;
};
  const [formData, setFormData] = useState<FormData>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    description: "",
    responsibilities: "",
    qualifications: "",
    benefits: "",
    experienceLevel: "",
    skills: "",
    applicationDeadline: "",
    status: "Active",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

const fetchJobs = useCallback(async (): Promise<void> => {
  setIsLoading(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hr/jobs`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    const data: Job[] = await res.json();
    setJobs(data);
  } catch (e) {
    if (e instanceof Error) {
      setErrors({ general: e.message });
    } else {
      setErrors({ general: "An unexpected error occurred" });
    }
  } finally {
    setIsLoading(false);
  }
}, []);


  const createJob = async (jobPayload: { title: string; department: string; location: string; type: string; salaryMin: number; salaryMax: number; currency: string; description: string; responsibilities: string; qualifications: string; benefits: string; experienceLevel: string; skills: string; applicationDeadline: string; status: string; }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hr/jobs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(jobPayload),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create job");
    }
    return await res.json();
  };

  const updateJob = async (id: string | undefined, jobPayload: { title: string; department: string; location: string; type: string; salaryMin: number; salaryMax: number; currency: string; description: string; responsibilities: string; qualifications: string; benefits: string; experienceLevel: string; skills: string; applicationDeadline: string; status: string; }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hr/jobs/${id}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(jobPayload),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update job");
    }
    return await res.json();
  };

  const deleteJob = async (id: string): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hr/jobs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete job");
  }
};


  const toggleJobStatus = async (
  id: string,
  newStatus: Job["status"]
): Promise<Job> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hr/jobs/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update job status");
  }
  return await res.json();
};


  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  type Errors = {
  title?: string;
  department?: string;
  location?: string;
  description?: string;
  qualifications?: string;
  salaryMin?: string;
  salaryMax?: string;
  skills?: string;
  [key: string]: string | undefined; // for dynamic keys if needed
  };

  const validateForm = () => {
    const newErrors:Errors = {};
    if (!(formData.title || "").trim())
      newErrors.title = "Job title is required";
    if (!(formData.department || "").trim())
      newErrors.department = "Department is required";
    if (!(formData.location || "").trim())
      newErrors.location = "Location is required";
    if (!(formData.description || "").trim())
      newErrors.description = "Job description is required";
    if (!(formData.qualifications || "").trim())
      newErrors.qualifications = "Qualifications are required";

    if (formData.salaryMin && formData.salaryMax) {
      if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
        newErrors.salaryMax =
          "Maximum salary must be greater than minimum salary";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      salaryMin: "",
      salaryMax: "",
      currency: "USD",
      description: "",
      responsibilities: "",
      qualifications: "",
      benefits: "",
      experienceLevel: "",
      skills: "",
      applicationDeadline: "",
      status: "Active",
    });
    setErrors({});
    setSelectedJob(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setSuccessMessage("");
    setErrors({});

    const jobPayload = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      salaryMin: parseInt(formData.salaryMin) || 0,
      salaryMax: parseInt(formData.salaryMax) || 0,
      currency: formData.currency,
      description: formData.description,
      responsibilities: formData.responsibilities,
      qualifications: formData.qualifications,
      benefits: formData.benefits,
      experienceLevel: formData.experienceLevel,
      skills: formData.skills,
      applicationDeadline: formData.applicationDeadline,
      status: formData.status,
    };

    try {
      if (currentView === "create") {
        const response = await createJob(jobPayload);
        setJobs((prev) => [response.job || response, ...prev]);
        setSuccessMessage("Job posted successfully!");
      } else if (currentView === "edit" && selectedJob) {
        const jobId = selectedJob._id || selectedJob.id;
        const response = await updateJob(jobId, jobPayload);
        setJobs((prev) =>
          prev.map((job) =>
            job._id === jobId || job.id === jobId
              ? response
              : job
          )
        );
        setSuccessMessage("Job updated successfully!");
      }
      setTimeout(() => {
        setCurrentView("list");
        resetForm();
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (job: Job): void => {
  setSelectedJob(job);
  setFormData({
    title: job.title || "",
    department: job.department || "",
    location: job.location || "",
    type: job.type || "Full-time",
    salaryMin: job.salaryMin ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax ? String(job.salaryMax) : "",
    currency: job.currency || "USD",
    description: job.description || "",
    responsibilities: job.responsibilities || "",
    qualifications: job.qualifications || "",
    benefits: job.benefits || "",
    experienceLevel: job.experienceLevel || "",
    skills: Array.isArray(job.skills)
      ? job.skills.join(", ")
      : job.skills || "",
    applicationDeadline: job.applicationDeadline || "",
    status: job.status || "Active",
  });
  setCurrentView("edit");
};



  const handleDelete = async (id: string | undefined) => {
  if (!id) {
    setErrors({ general: "Job ID is missing" });
    return;
  }

  if (!window.confirm("Are you sure you want to delete this job posting?")) return;

  setIsLoading(true);
  try {
    await deleteJob(id); // Now TypeScript knows id is a string
    setJobs((prev) => prev.filter((job) => job.id !== id && job._id !== id));
    setSuccessMessage("Job deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (error) {
    if (error instanceof Error) {
      setErrors({ general: error.message });
    } else {
      setErrors({ general: String(error) });
    }
  } finally {
    setIsLoading(false);
  }
};


  const handleStatusToggle = async (id: string | undefined, currentStatus: string) => {
  if (!id) {
    setErrors({ general: "Job ID is missing" });
    return;
  }

  const newStatus = currentStatus === "Active" ? "Paused" : "Active";
  setIsLoading(true);

  try {
    const response = await toggleJobStatus(id, newStatus);

    setJobs((prev) =>
      prev.map((job) =>
        (job.id === id || job._id === id) ? response : job
      )
    );

    setSuccessMessage(`Job ${newStatus.toLowerCase()} successfully!`);
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (error) {
    if (error instanceof Error) {
      setErrors({ general: error.message });
    } else {
      setErrors({ general: String(error) });
    }
  } finally {
    setIsLoading(false);
  }
};


  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    const filter = filterStatus.toLowerCase();
    return (
      (job.title.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)) &&
      (filterStatus === "all" || job.status.toLowerCase() === filter)
    );
  });

  // Calculate job management specific stats
  const jobStats = {
  needsReview: jobs.filter(
    (job) => job.status === "Active" && (job.applications || 0) > 0
  ).length,

  drafts: jobs.filter((job) => job.status === "Draft").length,

  expiringSoon: jobs.filter((job) => {
    if (!job.applicationDeadline) return false;

    const deadline = new Date(job.applicationDeadline).getTime(); // ✅ convert to number safely
    const now = Date.now();
    const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    return daysUntil > 0 && daysUntil <= 7;
  }).length,

  recentlyUpdated: jobs.filter((job) => {
    if (!job.updatedAt) return false;

    const updated = new Date(job.updatedAt).getTime(); // ✅ convert to number safely
    const now = Date.now();
    const daysSince = Math.ceil((now - updated) / (1000 * 60 * 60 * 24));

    return daysSince <= 3;
  }).length,
};


  const renderForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView("list")}
            className="group flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <div className="p-2 rounded-xl group-hover:bg-white/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold">Back to Job Management</span>
          </button>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              {currentView === "create" ? (
                <Plus className="w-7 h-7 text-white" />
              ) : (
                <Edit className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {currentView === "create"
                  ? "Create New Job Posting"
                  : "Edit Job Posting"}
              </h1>
              <p className="text-slate-600 mt-1">
                {currentView === "create"
                  ? "Fill out the details below to post a new job opening"
                  : "Update the job details and save your changes"}
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center space-x-3 shadow-sm">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-emerald-900 font-semibold">{successMessage}</p>
            </div>
          )}

          {errors.general && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center space-x-3 shadow-sm">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-red-900 font-semibold">{errors.general}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span>Basic Information</span>
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
                        errors.title
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      }`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-2 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.title}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
                        errors.department
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      }`}
                      placeholder="e.g., Engineering"
                    />
                    {errors.department && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-2 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.department}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
                        errors.location
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      }`}
                      placeholder="e.g., San Francisco, CA or Remote"
                    />
                    {errors.location && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-2 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.location}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Job Type
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 appearance-none font-medium"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 appearance-none font-medium"
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compensation Section */}
              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span>Compensation</span>
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 appearance-none font-medium"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 font-medium"
                      placeholder="80000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
                        errors.salaryMax
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      }`}
                      placeholder="120000"
                    />
                    {errors.salaryMax && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-2 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.salaryMax}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Details Section */}
              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span>Job Details</span>
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-5 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
                        errors.description
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      }`}
                      placeholder="Provide a comprehensive description of the role..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-2 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Key Responsibilities
                      </label>
                      <textarea
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 font-medium"
                        placeholder="List the main responsibilities..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Required Qualifications *
                      </label>
                      <textarea
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-5 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-200 font-medium ${
                          errors.qualifications
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                        }`}
                        placeholder="List required education, experience, skills..."
                      />
                      {errors.qualifications && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-2 font-medium">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.qualifications}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Benefits & Perks
                      </label>
                      <textarea
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 font-medium"
                        placeholder="Health insurance, retirement plans..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Experience Level
                      </label>
                      <input
                        type="text"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 font-medium"
                        placeholder="e.g., 3-5 years, Entry Level"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView("list")}
                className="px-6 py-3.5 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-white hover:border-slate-400 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>
                      {currentView === "create"
                        ? "Create Job Posting"
                        : "Update Job Posting"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-primary-700 to-purple-700 bg-clip-text text-transparent">
                  Job Management
                </h1>
                <p className="text-slate-600 text-lg mt-1">
                  Create, edit, and manage all your job postings
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setCurrentView("create");
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Job</span>
            </button>
          </div>

          {/* Job Management Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Needs Review
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {jobStats.needsReview}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Active jobs with applications
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Drafts
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {jobStats.drafts}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Jobs in draft status</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Expiring Soon
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {jobStats.expiringSoon}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Deadline within 7 days</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Recently Updated
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {jobStats.recentlyUpdated}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Modified in last 3 days</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job postings by title, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 font-medium"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 pr-12 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex items-center space-x-2 px-4 py-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border-2 border-primary-200">
                <Filter className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-bold text-primary-900">
                  {filteredJobs.length} of {jobs.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center space-x-3 shadow-sm">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-emerald-900 font-semibold">{successMessage}</p>
          </div>
        )}

        {errors.general && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center space-x-3 shadow-sm">
            <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-red-900 font-semibold">{errors.general}</p>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 animate-spin"></div>
                </div>
                <p className="text-slate-700 font-semibold text-lg">
                  Loading jobs...
                </p>
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job._id || job.id}
                className="group bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-200 hover:border-primary-300 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient top accent */}
                <div className="h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                              {job.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                                job.status === "Active"
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                                  : job.status === "Paused"
                                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                                  : "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full mr-2 bg-white animate-pulse"></div>
                              {job.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100">
                          <Building2 className="w-4 h-4 text-primary-500" />
                          <span className="text-sm font-semibold text-slate-700">
                            {job.department}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          <span className="text-sm font-semibold text-slate-700">
                            {job.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-semibold text-slate-700">
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-100">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-semibold text-slate-700">
                              {job.postedDate
                                ? !isNaN(new Date(job.postedDate).getTime())
                                  ? new Date(job.postedDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Invalid date"
                                : "N/A"}
                            </span>
                          </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-900">
                            {job.applications || 0}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            applications
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-900">
                            {job.views || 0}
                          </span>
                          <span className="text-xs text-purple-600 font-medium">
                            views
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs text-emerald-600 font-medium">
                            Updated 2d ago
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <button
                        onClick={() => handleStatusToggle(job.id, job.status)}
                        className={`p-3 rounded-xl transition-all hover:scale-110 ${
                          job.status === "Active"
                            ? "text-amber-600 hover:bg-amber-50 bg-amber-50/50"
                            : "text-emerald-600 hover:bg-emerald-50 bg-emerald-50/50"
                        }`}
                        title={
                          job.status === "Active" ? "Pause Job" : "Activate Job"
                        }
                      >
                        {job.status === "Active" ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          window.location.href = `/hr/application-management?job=${encodeURIComponent(job.title)}`;
                        }}
                        className="p-3 text-blue-600 hover:bg-blue-50 bg-blue-50/50 rounded-xl transition-all hover:scale-110"
                        title="View Applications"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-3 text-slate-600 hover:bg-slate-50 bg-slate-50/50 rounded-xl transition-all hover:scale-110"
                        title="Edit Job"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job._id || job.id)}
                        className="p-3 text-red-600 hover:bg-red-50 bg-red-50/50 rounded-xl transition-all hover:scale-110"
                        title="Delete Job"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Public listing</span>
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>
                          {job.currency || "USD"}{" "}
                          {parseInt(job.salaryMin).toLocaleString()} -{" "}
                          {parseInt(job.salaryMax).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = `/hr/application-management?job=${encodeURIComponent(job.title)}`;
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Applications</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/50 shadow-lg py-20">
              <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Briefcase className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No job postings found
                </h3>
                <p className="text-slate-600 mb-8">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Get started by creating your first job posting"}
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setCurrentView("create");
                  }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Job</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        :root {
          --primary-50: #f0f9ff;
          --primary-100: #e0f2fe;
          --primary-200: #bae6fd;
          --primary-300: #7dd3fc;
          --primary-400: #38bdf8;
          --primary-500: #0ea5e9;
          --primary-600: #0284c7;
          --primary-700: #0369a1;
          --primary-800: #075985;
          --primary-900: #0c4a6e;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );

  return <div>{currentView === "list" ? renderListView() : renderForm()}</div>;
}
