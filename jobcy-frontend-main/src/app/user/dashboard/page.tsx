// src/app/user/dashboard/page.tsx
"use client";

import { SetStateAction, useState, useEffect } from "react";
import {
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { useDashboardData } from "../../user/dashboard/hooks/useDashboardData";
import Sidebar from "../../user/dashboard/components/Sidebar";
import ProfileTab from "../../user/dashboard/components/ProfileTab";
import JobsTab from "../../user/dashboard/components/JobsTab";
import AppliedJobsTab from "../../user/dashboard/components/AppliedJobsTab";
import ConnectTab from "../../user/dashboard/components/ConnectTab";
import ConnectionRequestsTab from "../../user/dashboard/components/ConnectionRequestsTab";
import InterviewsTab from "../../user/dashboard/components/InterviewsTab";
import ProfileEditModal from "../../user/dashboard/components/ProfileEditModal";
import NotificationsTab from "./components/NotificationsTab";

import { UserProfile } from "@/app/types/dashboard";

export default function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDark, setIsDark] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalSection, setProfileModalSection] = useState<string>("personal");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if user has correct role
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== "user") {
          console.log("⚠️ Unauthorized access to user dashboard. Redirecting...");
          if (user.role === "hr") {
            window.location.href = "/hr/dashboard";
          } else if (user.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/user/auth/login";
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    }
  }, []);

  const {
    isLoading,
    userProfile,
    education,
    experience,
    allJobs,
    connections,
    interviews,
    updateProfile,
    handleJobApplication,
    refetch,
  } = useDashboardData();

  // Helper: get first letter of name
  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : "U");

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/user/auth/login";
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className={`mt-6 text-lg font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Loading your dashboard...
          </p>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header */}
      <header className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border-b sticky top-0 z-50 shadow-sm`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-2 rounded-lg ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Jobcy</h1>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Find Your Dream Job</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className={`relative w-full ${isDark ? "bg-slate-700" : "bg-slate-100"} rounded-xl`}>
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  className={`w-full pl-12 pr-4 py-2.5 bg-transparent border-none focus:outline-none ${
                    isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl transition-all ${
                  isDark ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              {/* Notifications */}
              <button
                onClick={() => setActiveTab("notifications")}
                className={`relative p-2.5 rounded-xl transition-colors ${
                  isDark ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button
                className={`p-2.5 rounded-xl transition-colors ${
                  isDark ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">{getInitial(userProfile.name)}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{userProfile.name}</p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{userProfile.title || "Job Seeker"}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 hidden md:block ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                </button>

                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-56 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border rounded-xl shadow-xl py-2 z-50`}>
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{userProfile.name}</p>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{userProfile.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
                    >
                      View Profile
                    </button>
                    <button className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}>
                      Account Settings
                    </button>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isDark ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"}`}
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex">
        <div className={`${showMobileMenu ? "block" : "hidden"} lg:block`}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab: SetStateAction<string>) => {
              setActiveTab(tab);
              setShowMobileMenu(false);
            }}
            isDark={isDark}
            userProfile={userProfile}
            interviewsCount={interviews.length}
          />
        </div>

        <main className="flex-1 p-6 overflow-x-hidden">
          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className={`relative w-full ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border rounded-xl`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type="text"
                placeholder="Search jobs..."
                className={`w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none ${
                  isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>

          {/* Tabs */}
          {activeTab === "profile" && (
            <ProfileTab
              userProfile={userProfile}
              education={education}
              experience={experience}
              isDark={isDark}
              onEditProfile={(section = "personal") => {
                setProfileModalSection(section);
                setShowProfileModal(true);
              }}
              updateProfile={updateProfile}
            />
          )}

          {activeTab === "jobs" && (
            <JobsTab
              allJobs={allJobs.map((j) => ({ ...j, id: String(j.id) }))}
              isDark={isDark}
              onApplyJob={handleJobApplication}
            />
          )}

          {activeTab === "applied" && <AppliedJobsTab isDark={isDark} />}

          {activeTab === "connect" && <ConnectTab connections={connections} isDark={isDark} />}

          {activeTab === "requests" && <ConnectionRequestsTab isDark={isDark} />}

          {activeTab === "notifications" && <NotificationsTab isDark={isDark} />}

          {activeTab === "interviews" && interviews.length > 0 && (
            <InterviewsTab
  interviews={interviews.map((i) => ({
    ...i,
    id: String(i.id),
    jobId: i.jobId !== undefined ? String(i.jobId) : undefined, // <-- convert jobId to string
  }))}
  isDark={isDark}
/>
          )}
          {activeTab === "interviews" && interviews.length === 0 && (
            <div className="text-center mt-16 text-slate-500 dark:text-slate-400">No interviews scheduled yet.</div>
          )}
        </main>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <ProfileEditModal
          userProfile={userProfile}
          experience={experience}
          isDark={isDark}
          initialSection={profileModalSection}
          onClose={() => setShowProfileModal(false)}
          onSave={async (data: Partial<UserProfile>) => {
            // normalize optional fields to satisfy types
            const normalizedData: Partial<UserProfile> = {
              ...data,
              education: data.education?.map((e) => ({ ...e, endDate: e.endDate || "" })),
              experienceList: data.experienceList?.map((e) => ({ ...e, endDate: e.endDate || "" })),
            };
            const result = await updateProfile(normalizedData);
            if (result.success) {
              refetch();
            }
            return result;
          }}
        />
      )}

      {/* Overlays */}
      {showMobileMenu && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowMobileMenu(false)}></div>}
      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>}
    </div>
  );
}
