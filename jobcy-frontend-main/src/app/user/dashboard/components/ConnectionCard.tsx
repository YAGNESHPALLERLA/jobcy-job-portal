"use client";

import React from "react";
import {
  MessageSquare,
  Eye,
  UserPlus,
  Briefcase,
  GraduationCap,
  Clock,
} from "lucide-react";

// ✅ Define the expected structure of a "connection" object
export interface Connection {
  id: string | number;
  name: string;
  title?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  status?: "seeking" | "open" | "employed";
  connected?: boolean;
}

// ✅ Define props for the component
interface ConnectionCardProps {
  connection: Connection;
  isDark?: boolean;
  onConnect?: (connection: Connection) => void;
  onMessage?: (connection: Connection) => void;
}

export default function ConnectionCard({
  connection,
  isDark = false,
  onConnect,
  onMessage,
}: ConnectionCardProps) {
  // Extract first letter from name for avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Generate random gradient colors based on name
  const getGradientColors = (name: string) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-teal-500 to-cyan-600",
    ];
    const index = name ? name.length % gradients.length : 0;
    return gradients[index];
  };

  // Get status badge based on connection status
  const getStatusBadge = () => {
    if (connection.status === "seeking") {
      return {
        text: "Actively Job Seeking",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400",
      };
    } else if (connection.status === "open") {
      return {
        text: "Open to Opportunities",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400",
      };
    } else if (connection.status === "employed") {
      return {
        text: "Currently Employed",
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className={`${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      } rounded-xl border p-6 hover:shadow-lg transition-all`}
    >
      <div className="flex items-start space-x-4 mb-4">
        {/* Profile Picture with Gradient */}
        <div
          className={`w-16 h-16 bg-gradient-to-br ${getGradientColors(
            connection.name
          )} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <span className="text-white font-bold text-2xl">
            {getInitial(connection.name)}
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-lg ${
              isDark ? "text-white" : "text-slate-900"
            } truncate`}
          >
            {connection.name}
          </h3>

          {/* Current Role or Title */}
          <p
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-700"
            } mt-1 flex items-center`}
          >
            <Briefcase className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">
              {connection.title || "Professional"}
            </span>
          </p>

          {/* Experience or Education */}
          {connection.experience && (
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-slate-600"
              } mt-1 flex items-center`}
            >
              <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
              {connection.experience} experience
            </p>
          )}

          {connection.education && (
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-slate-600"
              } mt-1 flex items-center`}
            >
              <GraduationCap className="w-3 h-3 mr-1.5 flex-shrink-0" />
              {connection.education}
            </p>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {statusBadge && (
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
          >
            {statusBadge.text}
          </span>
        </div>
      )}

      {/* Skills Preview */}
      {connection.skills && connection.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {connection.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded ${
                  isDark
                    ? "bg-slate-700 text-slate-300"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {skill}
              </span>
            ))}
            {connection.skills.length > 3 && (
              <span
                className={`px-2 py-1 text-xs rounded ${
                  isDark
                    ? "bg-slate-700 text-slate-400"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                +{connection.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        {connection.connected ? (
          <>
            <button
              onClick={() => onMessage && onMessage(connection)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border font-medium ${
                isDark
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              } transition-colors`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg ${
                isDark
                  ? "hover:bg-slate-700 text-slate-400"
                  : "hover:bg-slate-100 text-slate-600"
              } transition-colors`}
              title="View Profile"
            >
              <Eye className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect && onConnect(connection)}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </div>
  );
}
