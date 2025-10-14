"use client";

import React from "react";
import {
  MapPin,
  Briefcase,
  CheckCircle,
  Loader2,
  Bookmark,
} from "lucide-react";

// ✅ Define a reusable Job type
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted: string;
  applicants: number;
  hasApplied?: boolean;
  isApplying?: boolean;
  isSaved?: boolean;
}

// ✅ Define props for the component
interface JobCardProps {
  job: Job;
  isDark?: boolean;
  onApply?: (job: Job) => void;
  onSave?: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isDark = false, onApply, onSave }) => {
  return (
    <div
      className={`${
        isDark
          ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
          : "bg-white border-slate-200 hover:bg-slate-50"
      } rounded-xl border p-6 transition-all hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-slate-900"
              } hover:text-blue-600 transition-colors cursor-pointer`}
            >
              {job.title}
            </h3>
            {job.hasApplied && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Applied</span>
              </div>
            )}
          </div>

          <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
            {job.company}
          </p>

          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span
              className={`flex items-center space-x-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </span>
            <span
              className={`flex items-center space-x-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              {job.salary}
            </span>
          </div>

          <p
            className={`${
              isDark ? "text-slate-400" : "text-slate-600"
            } text-sm mt-3 line-clamp-2`}
          >
            {job.description}
          </p>

          <div
            className={`flex items-center space-x-4 mt-3 text-xs ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <span>{job.posted}</span>
            <span>•</span>
            <span>{job.applicants} applicants</span>
          </div>
        </div>

        <div className="ml-4 flex flex-col space-y-2">
          <button
            onClick={() => onApply?.(job)}
            disabled={job.hasApplied || job.isApplying}
            className={`px-6 py-2 rounded-lg font-medium transition-colors min-w-[120px] flex items-center justify-center ${
              job.hasApplied
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : job.isApplying
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {job.isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Applying...
              </>
            ) : job.hasApplied ? (
              "Applied"
            ) : (
              "Apply Now"
            )}
          </button>

          <button
            onClick={() => onSave?.(job)}
            className={`px-6 py-2 rounded-lg font-medium transition-all min-w-[120px] flex items-center justify-center space-x-2 ${
              job.isSaved
                ? isDark
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${job.isSaved ? "fill-current" : ""}`}
            />
            <span>{job.isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
