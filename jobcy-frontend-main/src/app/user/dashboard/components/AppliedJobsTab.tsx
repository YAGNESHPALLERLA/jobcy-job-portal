"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AppliedJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: "Applied" | "Under Review" | "Interview" | "Rejected" | "Accepted";
  appliedDate: string;
  type?: string;
}

interface AppliedJobsTabProps {
  isDark: boolean;
}

export default function AppliedJobsTab({ isDark }: AppliedJobsTabProps) {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppliedJobs();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchAppliedJobs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedJobs(data);
      } else {
        setError("Failed to fetch applied jobs");
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setError("Unable to load applied jobs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Applied":
        return <Clock className="w-4 h-4" />;
      case "Under Review":
        return <AlertCircle className="w-4 h-4" />;
      case "Interview":
        return <Calendar className="w-4 h-4" />;
      case "Accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className={`mt-4 text-lg font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark ? "bg-red-900/20" : "bg-red-100"
        }`}>
          <XCircle className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-600"}`} />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
          Error Loading Applications
        </h3>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {error}
        </p>
        <button
          onClick={fetchAppliedJobs}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Applied Jobs
          </h2>
          <p className={`mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Track your job applications and their status
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
          <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            {appliedJobs.length} Application{appliedJobs.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Applications List */}
      {appliedJobs.length === 0 ? (
        <div className="text-center py-16">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark ? "bg-slate-800" : "bg-slate-100"
          }`}>
            <Briefcase className={`w-8 h-8 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
            No Applications Yet
          </h3>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Start applying to jobs to see your applications here
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appliedJobs.map((application) => (
            <div
              key={application.id}
              className={`${
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              } border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDark ? "bg-slate-700" : "bg-slate-100"
                    }`}>
                      <Briefcase className={`w-6 h-6 ${isDark ? "text-slate-300" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}>
                        {application.title}
                      </h3>
                      <p className={`text-sm font-medium mb-2 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {application.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.location}</span>
                        </div>
                        {application.salary && (
                          <div className="flex items-center space-x-1">
                            <span>₹{application.salary}</span>
                          </div>
                        )}
                        {application.type && (
                          <div className="flex items-center space-x-1">
                            <span>{application.type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span>{application.status}</span>
                  </div>

                  <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}