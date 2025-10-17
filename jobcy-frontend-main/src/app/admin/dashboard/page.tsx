"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  // Plus,
  Settings,
  LogOut,
  Search,
  Bell,
  Calendar,
  ArrowUpRight,
  Activity,
  Building2,
  UserCheck,
  Filter,
  Moon,
  Sun,
} from "lucide-react";
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon: React.ElementType;
  color?: string;
  onClick?: () => void;
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color?: string;
  onClick?: () => void;
}

interface ActivityItem {
  id: string | number;
  type: "hr_joined" | "job_posted" | "application";
  message: string;
  time: string;
}

interface RawUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
}

interface RawJob {
  id?: string;
  _id?: string;
  title: string;
  company: string;
  location?: string;
}

interface RawApplication {
  _id?: string;
  id?: string;
  jobId?: {
    _id?: string;
    title?: string;
    company?: string;
  };
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  status?: string;
  appliedDate?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("overview");

  const [stats, setStats] = useState({
    totalHRs: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [users, setUsers] = useState<RawUser[]>([]);
  const [jobs, setJobs] = useState<RawJob[]>([]);
  const [applications, setApplications] = useState<RawApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Refresh dashboard data
  const refreshDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setRefreshing(true);
    try {
      const [statsRes, activityRes, usersRes, jobsRes, applicationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/browse`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }
      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Simulate loading dashboard data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/auth/login"); // redirect if not logged in
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes, usersRes, jobsRes, applicationsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/browse`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        } else {
          console.error("Stats fetch failed:", statsRes.status, statsRes.statusText);
          if (statsRes.status === 403) {
            router.push("/admin/auth/login");
            return;
          }
        }
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setRecentActivity(activityData);
        } else {
          console.error("Activity fetch failed:", activityRes.status, activityRes.statusText);
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        } else {
          console.error("Users fetch failed:", usersRes.status, usersRes.statusText);
        }
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        } else {
          console.error("Jobs fetch failed:", jobsRes.status, jobsRes.statusText);
        }
        if (applicationsRes.ok) {
          const applicationsData = await applicationsRes.json();
          setApplications(applicationsData);
        } else {
          console.error("Applications fetch failed:", applicationsRes.status, applicationsRes.statusText);
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        router.push("/admin/auth/login"); // if token expired, go back to login
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Auto-refresh applications data every 5 seconds when on applications tab
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && activeTab === "applications") {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              console.error("Auto-refresh applications failed:", res.status, res.statusText);
              return [];
            }
          })
          .then(data => setApplications(data))
          .catch(err => console.error("Auto-refresh applications error:", err));
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  // Auto-refresh stats data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              console.error("Auto-refresh stats failed:", res.status, res.statusText);
              return null;
            }
          })
          .then(data => {
            if (data) setStats(data);
          })
          .catch(err => console.error("Auto-refresh stats error:", err));
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-refresh recent activity data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              console.error("Auto-refresh activity failed:", res.status, res.statusText);
              return [];
            }
          })
          .then(data => setRecentActivity(data))
          .catch(err => console.error("Auto-refresh activity error:", err));
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color,
    onClick,
  }) => (
    <div
      className={`${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-emerald-600"
          : "bg-white border-gray-200 hover:border-emerald-500"
      } rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all cursor-pointer group ${
        onClick ? "hover:scale-105 transform" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } text-sm font-medium`}
          >
            {title}
          </p>
          <p
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mt-2`}
          >
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 text-sm font-medium">
                +{change}% this month
              </span>
            </div>
          )}
          {onClick && (
            <div className={`flex items-center mt-3 text-xs font-semibold ${
              isDarkMode ? "text-emerald-400" : "text-emerald-600"
            } opacity-0 group-hover:opacity-100 transition-opacity`}>
              <span>View Details</span>
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    description,
    icon: Icon,
    color,
    onClick,
  }) => (
    <div
      className={`${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-emerald-600"
          : "bg-white border-gray-200 hover:border-emerald-500"
      } rounded-xl p-6 shadow-sm border hover:shadow-md hover:scale-105 transition-all cursor-pointer group`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold ${
              isDarkMode
                ? "text-white group-hover:text-emerald-400"
                : "text-gray-900 group-hover:text-emerald-600"
            } transition-colors`}
          >
            {title}
          </h3>
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } text-sm mt-1`}
          >
            {description}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${color} ml-4`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div
        className={`flex items-center ${
          isDarkMode
            ? "text-emerald-400 group-hover:text-emerald-300"
            : "text-emerald-600 group-hover:text-emerald-700"
        } text-sm font-medium mt-4`}
      >
        <span>Manage</span>
        <ArrowUpRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } shadow-sm border-b`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Job Portal Admin
                  </h1>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Dashboard Overview
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  } absolute left-3 top-1/2 transform -translate-y-1/2`}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                      : "border-gray-300 bg-gray-50 focus:bg-white focus:ring-emerald-500 focus:border-emerald-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 w-64`}
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                } rounded-lg transition-colors`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                className={`p-2 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                } rounded-lg transition-colors`}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                className={`p-2 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                } rounded-lg transition-colors`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                className={`flex items-center space-x-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors`}
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold text-sm">
                    A
                  </span>
                </div>
                <span className="font-medium">Admin</span>
              </button>
              <button
                className={`p-2 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20"
                    : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                } rounded-lg transition-colors`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={`border-b ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "users", label: "Users", icon: Users },
              { id: "jobs", label: "Jobs", icon: Briefcase },
              { id: "applications", label: "Applications", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Refresh data when switching to applications tab
                    if (tab.id === "applications") {
                      refreshDashboardData();
                    }
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? "border-emerald-400 text-emerald-400"
                        : "border-emerald-500 text-emerald-600"
                      : isDarkMode
                      ? "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
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
        {(() => {
          switch (activeTab) {
            case "overview":
              return (
                <div>
                  {/* Welcome Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2
                          className={`text-2xl font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Welcome back, Admin
                        </h2>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          } mt-1`}
                        >
                          Here it is what is happening with your job portal today.
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex items-center ${
                            isDarkMode
                              ? "text-gray-300 bg-gray-800 border-gray-700"
                              : "text-gray-600 bg-white border-gray-200"
                          } px-3 py-2 rounded-lg border`}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {new Date().toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                      title="Total HRs (Users)"
                      value={stats.totalHRs}
                      change="12"
                      icon={Users}
                      color="bg-blue-500"
                      onClick={() => setActiveTab("users")}
                    />
                    <StatCard
                      title="Jobs Posted by HRs"
                      value={stats.totalJobs}
                      change="8"
                      icon={Briefcase}
                      color="bg-emerald-500"
                      onClick={() => setActiveTab("jobs")}
                    />
                    <StatCard
                      title="Applications Received"
                      value={stats.totalApplications.toLocaleString()}
                      change="23"
                      icon={FileText}
                      color="bg-amber-500"
                      onClick={() => setActiveTab("applications")}
                    />
                    <StatCard
                      title="Active Job Listings"
                      value={stats.activeJobs}
                      change="5"
                      icon={Activity}
                      color="bg-red-500"
                      onClick={() => setActiveTab("jobs")}
                    />
                  </div>

                  {/* Quick Actions & Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2">
                      <div
                        className={`${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } rounded-xl shadow-sm border p-6`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3
                            className={`text-lg font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Quick Management
                          </h3>
                          <Filter
                            className={`w-5 h-5 ${
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <QuickActionCard
                            title="HR Management"
                            description="Manage HR users, approvals, and permissions"
                            icon={Users}
                            color="bg-blue-500"
                            onClick={() => router.push("/admin/hr-management")}
                          />
                          <QuickActionCard
                            title="Job Listings"
                            description="Review, approve, and manage job posts"
                            icon={Briefcase}
                            color="bg-emerald-500"
                            onClick={() => setActiveTab("jobs")}
                          />
                          <QuickActionCard
                            title="Applications"
                            description="Monitor application flow and analytics"
                            icon={FileText}
                            color="bg-amber-500"
                            onClick={() => setActiveTab("applications")}
                          />
                          <QuickActionCard
                            title="Company Profiles"
                            description="Manage company registrations and profiles"
                            icon={Building2}
                            color="bg-red-500"
                            onClick={() => router.push("/admin/company-management")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div
                      className={`${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } rounded-xl shadow-sm border p-6`}
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        } mb-6`}
                      >
                        Recent Activity
                      </h3>

                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.type === "hr_joined"
                                  ? isDarkMode
                                    ? "bg-blue-900 bg-opacity-30"
                                    : "bg-blue-100"
                                  : activity.type === "job_posted"
                                  ? isDarkMode
                                    ? "bg-emerald-900 bg-opacity-30"
                                    : "bg-emerald-100"
                                  : isDarkMode
                                  ? "bg-amber-900 bg-opacity-30"
                                  : "bg-amber-100"
                              }`}
                            >
                              {activity.type === "hr_joined" && (
                                <UserCheck className="w-4 h-4 text-blue-500" />
                              )}
                              {activity.type === "job_posted" && (
                                <Briefcase className="w-4 h-4 text-emerald-500" />
                              )}
                              {activity.type === "application" && (
                                <FileText className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {activity.message}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-500" : "text-gray-500"
                                } mt-1`}
                              >
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        className={`w-full mt-4 ${
                          isDarkMode
                            ? "text-emerald-400 hover:text-emerald-300 border-gray-600 hover:bg-gray-700"
                            : "text-emerald-600 hover:text-emerald-700 border-gray-200 hover:bg-emerald-50"
                        } text-sm font-medium py-2 border rounded-lg transition-colors`}
                      >
                        View All Activity
                      </button>
                    </div>
                  </div>
                </div>
              );
            case "users":
              return (
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                    User Management
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user: RawUser) => (
                      <div key={user._id} className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{user.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case "jobs":
              return (
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                    Job Listings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map((job: RawJob) => (
                      <div key={job.id || job._id} className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{job.title}</h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{job.company}</p>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{job.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case "applications":
              return (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Applications
                    </h2>
                    <button
                      onClick={refreshDashboardData}
                      disabled={refreshing}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800"
                          : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
                      } disabled:cursor-not-allowed`}
                    >
                      {refreshing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Refreshing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Refresh</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {applications.length === 0 ? (
                      <div className={`p-8 rounded-lg border text-center ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          No applications found
                        </p>
                        <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                          Applications will appear here when users apply to jobs
                        </p>
                      </div>
                    ) : (
                      applications.map((app: RawApplication) => (
                        <div key={app._id || app.id} className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                          <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {app.jobId?.title || 'Unknown Job'} - {app.userId?.name || 'Unknown User'}
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Status: {app.status || 'Applied'} | Applied: {new Date(app.appliedDate || app.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                          {app.userId?.email && (
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                              Email: {app.userId.email}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
