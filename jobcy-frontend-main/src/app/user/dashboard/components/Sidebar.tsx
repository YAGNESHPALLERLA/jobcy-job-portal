"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  User,
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  LucideIcon
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
};

type UserProfile = {
  name: string;
  title?: string;
  connections?: number;
  profileCompletion?: number;
};
type SidebarProps = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  isDark: boolean;
  userProfile: UserProfile;
  interviewsCount: number;
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  isDark,
  userProfile,
  interviewsCount,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems: NavItem[] = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "jobs", label: "Find Jobs", icon: Briefcase },
    { id: "applied", label: "Applied Jobs", icon: CheckSquare },
    { id: "connect", label: "Network", icon: Users },
    // { id: "requests", label: "Requests", icon: Bell },
    {
      id: "interviews",
      label: "Interviews",
      icon: Calendar,
      badge: interviewsCount,
      disabled: interviewsCount === 0,
    },
  ];

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const completionPercentage = userProfile.profileCompletion || 0;

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getCompletionMessage = (percentage: number) => {
    if (percentage >= 80) return "Great profile!";
    if (percentage >= 50) return "Almost there";
    return "Complete your profile";
  };

  return (
    <>
      <aside
        className={`${isExpanded ? "w-72" : "w-20"} ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } border-r min-h-[calc(100vh-73px)] sticky top-[73px] flex flex-col transition-all duration-300 ease-in-out relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -right-3 top-6 w-6 h-6 rounded-full ${
            isDark
              ? "bg-slate-700 hover:bg-slate-600"
              : "bg-white hover:bg-slate-100"
          } border ${
            isDark ? "border-slate-600" : "border-slate-300"
          } flex items-center justify-center shadow-lg transition-all z-10`}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Profile Card */}
        <div
          className={`p-4 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div
            className={`flex items-center ${
              isExpanded ? "space-x-3" : "justify-center"
            } mb-3`}
          >
            <div
              className={`${
                isExpanded ? "w-12 h-12" : "w-10 h-10"
              } bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 transition-all`}
            >
              <span
                className={`text-white font-bold ${
                  isExpanded ? "text-xl" : "text-lg"
                }`}
              >
                {getInitial(userProfile.name)}
              </span>
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <h3
                  className={`font-semibold truncate ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {userProfile.name || "User"}
                </h3>
                <p
                  className={`text-xs truncate ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {userProfile.title || "Professional"}
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {isExpanded && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <div
                className={`${
                  isDark ? "bg-slate-700" : "bg-slate-50"
                } rounded-lg p-3`}
              >
                <div className="flex items-center justify-between mb-1">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Views
                  </span>
                </div>
                <p
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  1.2K
                </p>
              </div>
              <div
                className={`${
                  isDark ? "bg-slate-700" : "bg-slate-50"
                } rounded-lg p-3`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Users
                    className={`w-4 h-4 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Network
                  </span>
                </div>
                <p
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {userProfile.connections || 0}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {isExpanded && (
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${
                isDark ? "text-slate-500" : "text-slate-400"
              } animate-fade-in`}
            >
              Menu
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                title={!isExpanded ? item.label : ""}
                className={`w-full flex items-center ${
                  isExpanded ? "space-x-3 px-4" : "justify-center px-2"
                } py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? isDark
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : item.disabled
                    ? isDark
                      ? "text-slate-600 cursor-not-allowed"
                      : "text-slate-400 cursor-not-allowed"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isActive && isExpanded && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    } transition-transform`}
                  />
                  {(item.badge ?? 0) > 0 && !isExpanded && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                {isExpanded && (
                  <>
                    <span className="font-medium flex-1 text-left animate-fade-in">
                      {item.label}
                    </span>
                    {(item.badge ?? 0) > 0 && (
                      <span
                        className={`${
                          isActive
                            ? "bg-white text-blue-600"
                            : "bg-red-500 text-white"
                        } text-xs px-2 py-1 rounded-full font-semibold animate-fade-in`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Strength Card */}
        {isExpanded && (
          <div
            className={`p-4 border-t ${
              isDark ? "border-slate-700" : "border-slate-200"
            } animate-fade-in`}
          >
            <div
              className={`${
                isDark
                  ? "bg-gradient-to-br from-slate-700 to-slate-800"
                  : "bg-gradient-to-br from-slate-50 to-slate-100"
              } rounded-xl p-5 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Award
                    className={`w-5 h-5 ${
                      completionPercentage >= 80
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  />
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    Profile Strength
                  </p>
                </div>
                <span
                  className={`text-xs font-bold ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {completionPercentage}%
                </span>
              </div>

              <div
                className={`w-full ${
                  isDark ? "bg-slate-600" : "bg-slate-200"
                } rounded-full h-2.5 mb-3 overflow-hidden`}
              >
                <div
                  className={`${getCompletionColor(
                    completionPercentage
                  )} h-2.5 rounded-full transition-all duration-500 shadow-sm`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              <p
                className={`text-xs ${
                  isDark ? "text-slate-400" : "text-slate-600"
                } mb-3`}
              >
                {getCompletionMessage(completionPercentage)}
              </p>

              {completionPercentage < 100 && (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  Complete Profile
                </button>
              )}
            </div>
          </div>
        )}

      </aside>

      {/* Add CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
