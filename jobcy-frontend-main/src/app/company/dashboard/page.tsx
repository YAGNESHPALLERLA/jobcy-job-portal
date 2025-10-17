"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  FileText,
  Users,
  LogOut,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Download,
} from "lucide-react";

interface DashboardStats {
  companyName: string;
  companyEmail: string;
  totalHRs: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  hrUsers: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

interface Job {
  _id: string;
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  status: string;
  applicants: number;
  postedDate: string;
  careerLevel?: string;
  postedBy: string;
}

interface Application {
  _id: string;
  id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
    currentLocation?: string;
    skills?: string[];
    resume?: string;
  };
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    postedBy?: {
      name: string;
      email: string;
    };
  };
  status: string;
  createdAt: string;
  appliedDate?: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applications">("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes, applicationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/dashboard`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/jobs`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/applications`, {
          headers: getAuthHeaders(),
        }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data);
      }

      if (applicationsRes.ok) {
        const data = await applicationsRes.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        alert(`Application status updated to ${newStatus}`);
        fetchDashboardData();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/auth/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/auth/login");
      return;
    }

    fetchDashboardData();
  }, [router, fetchDashboardData]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{stats.companyName}</h1>
                <p className="text-sm text-gray-600">Company Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setRefreshing(true);
                  fetchDashboardData().finally(() => setRefreshing(false));
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview" as const, label: "Overview", icon: TrendingUp },
              { id: "jobs" as const, label: "Jobs", icon: Briefcase },
              { id: "applications" as const, label: "Applications", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total HR Staff</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalHRs}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</p>
                    <p className="text-xs text-green-600 mt-1">{stats.activeJobs} Active</p>
                  </div>
                  <div className="p-3 bg-emerald-500 rounded-full">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
                    <p className="text-xs text-orange-600 mt-1">{stats.pendingApplications} Pending</p>
                  </div>
                  <div className="p-3 bg-amber-500 rounded-full">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.acceptedApplications}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* HR Users */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">HR Team Members</h3>
              <div className="space-y-3">
                {stats.hrUsers.map((hr) => (
                  <div key={hr._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{hr.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{hr.name}</p>
                      <p className="text-sm text-gray-600">{hr.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Company Jobs</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                <Briefcase className="w-4 h-4" />
                <span className="font-semibold">{jobs.length} Total Jobs</span>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Posted Yet</h3>
                <p className="text-gray-600">Jobs posted by your HR team will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                        {job.careerLevel && (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            job.careerLevel === "Fresher"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {job.careerLevel}
                          </span>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "Paused"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        Posted by: {job.postedBy}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        {job.applicants} applicants
                      </span>
                      <span className="text-xs text-gray-500">
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                  <FileText className="w-4 h-4" />
                  <span className="font-semibold">{applications.length} Total</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{stats.pendingApplications} Pending</span>
                </div>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600">Applications for your job postings will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {app.userId.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{app.userId.name}</h4>
                            <p className="text-sm text-gray-600">Applied for: {app.jobId.title}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {app.userId.email}
                          </div>
                          {app.userId.mobile && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {app.userId.mobile}
                            </div>
                          )}
                          {app.userId.currentLocation && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {app.userId.currentLocation}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Applied: {new Date(app.createdAt || app.appliedDate || Date.now()).toLocaleDateString()}
                          </div>
                        </div>

                        {app.userId.skills && app.userId.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {app.userId.skills.slice(0, 5).map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                            {app.userId.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                +{app.userId.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            app.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : app.status === "Interview"
                              ? "bg-purple-100 text-purple-700"
                              : app.status === "Under Review"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {app.status}
                          </span>
                          {app.jobId.postedBy && (
                            <span className="text-xs text-gray-500">
                              Posted by: {app.jobId.postedBy.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      {app.userId.resume && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}${app.userId.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Resume
                        </a>
                      )}
                      
                      {app.status !== "Accepted" && app.status !== "Rejected" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "Under Review")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Under Review
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "Interview")}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-medium transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            Schedule Interview
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "Accepted")}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "Rejected")}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

