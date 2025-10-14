// src/app/user/dashboard/components/JobsTab.tsx
"use client";

import React from "react";
import { Job } from "@/app/types/dashboard";

interface JobsTabProps {
  allJobs: Job[];
  isDark: boolean;
  onApplyJob: (jobId: string) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({ allJobs, isDark, onApplyJob }) => {
  return (
    <div>
      {allJobs.map((job) => (
        <div
          key={job.id}
          className={`p-4 mb-4 rounded-lg border ${
            isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"
          }`}
        >
          <h3 className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{job.title}</h3>
          <p className={`${isDark ? "text-slate-300" : "text-slate-700"}`}>{job.company} | {job.location}</p>
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>{job.description}</p>
          <button
            disabled={job.hasApplied}
            onClick={() => onApplyJob(job.id)}
            className={`mt-2 px-3 py-1 rounded-lg ${
              job.hasApplied
                ? "bg-gray-500 cursor-not-allowed"
                : isDark
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {job.hasApplied ? "Applied" : "Apply"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default JobsTab;
