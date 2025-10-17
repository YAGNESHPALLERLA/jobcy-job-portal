"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Eye,
  Settings,
  LogOut,
  Search,
  Bell,
  // TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Building2,
  MoreVertical,
  Edit,
  ChevronDown,
  Target,
  // Users,
  Calendar,
  // Award,
  // Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  // Share2,
  Sparkles,
  // TrendingDown,
  // CheckCircle2,
  XCircle,
  // AlertCircle,
  LucideIcon,
} from "lucide-react";
const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : "N/A";


export default function HRDashboard() {

  const [hrData, setHrData] = useState({ name: "", company: "", avatar: "" });
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
  });
  type Job = {
  id: string | number;
  _id?: string;
  title: string;
  company?: string;
  location?: string;
  type?: string;
  salary?: { currency: string; min: number; max: number } | string;
  status: string;
  postedDate?: string;
  createdAt?: string;
  applicants?: number;
  views?: number;
  department?: string;
};

const [jobsData, setJobsData] = useState<Job[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const dashRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hr/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!dashRes.ok) {
          if (dashRes.status === 401) {
            setError("Unauthorized. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/hr/auth/login";
            return;
          }
          throw new Error(`Failed to fetch dashboard info: ${dashRes.status}`);
        }

        const dashJson = await dashRes.json();

        setHrData({
          name: dashJson.name || "HR User",
          company: dashJson.company || "Unknown Company",
          avatar: (dashJson.name || "HR")
            .split(" ")
            .map((n:string) => n[0])
            .join("")
            .toUpperCase(),
        });

        setDashboardStats({
          totalJobs: dashJson.totalJobs || 0,
          activeJobs: dashJson.activeJobs || 0,
          totalApplications: dashJson.totalApplications || 0,
          pendingReviews: dashJson.pendingReviews || 0,
        });

        const jobsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hr/jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!jobsRes.ok) {
          throw new Error(`Failed to fetch jobs: ${jobsRes.status}`);
        }

        const jobsJson = await jobsRes.json();
        setJobsData(jobsJson || []);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
      finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatSalary = (salary?: string | { currency: string; min: number; max: number }) => {
    if (!salary) return "Not specified"; // handles undefined
    if (typeof salary === "string") return salary; // handles string salary
    // salary is now guaranteed to be { currency, min, max }
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`; 
  };

 type NameOrTitle = { name?: string; title?: string };
type RenderableField = string | number | null | undefined | NameOrTitle;
 const safeRender = (field: RenderableField) => {
   if (field == null) return "";

   if (typeof field === "object") {
     const obj = field as NameOrTitle;
     return obj.name || obj.title || JSON.stringify(field);
   }

   return String(field);
 };
 type StatCardProps = {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  gradient?: string;
  subtitle?: string;
  trend?: "up" | "down";
};
  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    gradient,
    subtitle,
    trend,
  }) => (
    <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-sm border border-slate-200/50 hover:shadow-2xl hover:border-transparent transition-all duration-500 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      ></div>

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div
            className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          {change && (
            <div
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                trend === "up"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-bold">{change}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-4xl font-bold text-slate-900 group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(100, (Number(value) / 50) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
  

  const JobCard = ({ job }: { job: Job }) => (
    <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {safeRender(job.title)}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      job.status === "Active"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                        : job.status === "Paused"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                        : "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/30"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 bg-white animate-pulse`}
                    ></div>
                    {safeRender(job.status || "Active")}
                  </span>
                  <span className="flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {formatDate(job.postedDate || job.createdAt)}
                    </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <button
                  className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-all hover:scale-110"
                  title="View Applications"
                  onClick={() => {
                    window.location.href = `/hr/application-management?job=${encodeURIComponent(safeRender(job._id || job.id))}`;
                  }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all hover:scale-110"
                  title="Edit Job"
                  onClick={() => alert(`Edit ${safeRender(job.title)}`)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all hover:scale-110">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                <Building2 className="w-4 h-4 text-primary-500" />
                <span className="font-medium">{safeRender(job.company)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="font-medium">{safeRender(job.location)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-medium">{safeRender(job.type)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold">
                  {formatSalary(job.salary)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">
                  {job.applicants || 0}
                </span>
                <span className="text-xs text-blue-600">applications</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-900">
                  {job.views || 0}
                </span>
                <span className="text-xs text-purple-600">views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredJobs = jobsData.filter((job) => {
    const lowerSearch = searchTerm.toLowerCase();
    const filter = filterStatus.toLowerCase();

    const matchSearch =
      (typeof job.title === "string" &&
        job.title.toLowerCase().includes(lowerSearch)) ||
      (typeof job.department === "string" &&
        job.department.toLowerCase().includes(lowerSearch)) ||
      (typeof job.location === "string" &&
        job.location.toLowerCase().includes(lowerSearch));
    const matchFilter =
      filter === "all" ||
      (typeof job.status === "string" && job.status.toLowerCase() === filter);

    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 animate-spin"></div>
          </div>
          <p className="text-slate-700 font-semibold text-lg">
            Loading your dashboard...
          </p>
          <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 font-medium mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-100/90 via-indigo-100/90 to-cyan-100/90 backdrop-blur-xl shadow-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg">
                    {hrData.avatar}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {hrData.name
                    ? `Welcome back, ${hrData.name.split(" ")[0]}! 👋`
                    : "Welcome"}
                </h1>
                <p className="text-sm text-slate-600 flex items-center space-x-2 mt-1">
                  <Building2 className="w-4 h-4 text-primary-500" />
                  <span className="font-medium">
                    {safeRender(hrData.company)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span className="text-emerald-600 font-medium">Active</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-3 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all hover:scale-105 group">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  3
                </span>
              </button>

              <button className="p-3 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all hover:scale-105">
                <Settings className="w-5 h-5" />
              </button>

              <div className="h-8 w-px bg-slate-200"></div>

              <button
                title="Logout"
                className="flex items-center space-x-2 px-4 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-105 group"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/hr/auth/login";
                }}
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-primary-700 to-purple-700 bg-clip-text text-transparent">
                Dashboard Overview
              </h2>
              <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <p className="text-slate-600 text-lg">
              Monitor your recruitment activities and track performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-slate-200 hover:border-primary-300 text-slate-700 rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
            <Link href="/hr/jobs-management">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-200 to-indigo-200 hover:from-blue-300 hover:to-indigo-300 text-slate-800 px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group">
                <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Manage Jobs</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Jobs"
            subtitle="All time postings"
            value={dashboardStats.totalJobs}
            change={12}
            trend="up"
            icon={Briefcase}
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="Active Jobs"
            subtitle="Currently hiring"
            value={dashboardStats.activeJobs}
            change={8}
            trend="up"
            icon={Target}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Applications"
            subtitle="Total received"
            value={dashboardStats.totalApplications}
            change={23}
            trend="up"
            icon={FileText}
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard
            title="Pending Reviews"
            subtitle="Awaiting action"
            value={dashboardStats.pendingReviews}
            change={-5}
            trend="down"
            icon={Clock}
            gradient="from-amber-500 to-orange-600"
          />
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Your Job Postings
                </h3>
                <p className="text-sm text-slate-600">
                  Manage and track all your active job listings
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Filter className="w-4 h-4 text-white absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <select
                    className="appearance-none bg-black text-white border-2 border-slate-200 hover:border-primary-300 rounded-xl pl-11 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <Search className="w-5 h-5 text-white absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-black text-white border-2 border-slate-200 hover:border-primary-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-72"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6 max-h-[900px] overflow-y-auto custom-scrollbar pr-2">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard key={job._id || job.id} job={job} />
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No jobs found
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Try adjusting your search criteria or create a new job
                    posting to get started
                  </p>
                  <Link href="/hr/jobs-management">
                    <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                      Create New Job
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0284c7, #7c3aed);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0369a1, #6d28d9);
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
