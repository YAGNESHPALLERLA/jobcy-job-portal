"use client";

import React from "react";
import { Calendar, Clock, BookOpen, User } from "lucide-react";

// ✅ Define the structure of the interview data
interface Interview {
  id: string;
  position: string;
  company: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
  status: string;
}

// ✅ Define the component props
interface InterviewCardProps {
  interview: Interview;
  isDark?: boolean;
  onViewDetails?: (interview: Interview) => void;
}

export default function InterviewCard({
  interview,
  isDark = false,
  onViewDetails,
}: InterviewCardProps) {
  return (
    <div
      className={`${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      } rounded-xl border p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-sm font-medium">
              {interview.status}
            </div>
          </div>

          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {interview.position}
          </h3>

          <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
            {interview.company}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div
              className={`flex items-center space-x-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{interview.date}</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">{interview.time}</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{interview.type}</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-sm">
                Interviewer: {interview.interviewer}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onViewDetails && onViewDetails(interview)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
