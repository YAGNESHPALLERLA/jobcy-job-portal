// src/app/user/dashboard/components/InterviewsTab.tsx
"use client";

import React from "react";
import { Interview } from "@/app/types/dashboard";

interface InterviewsTabProps {
  interviews: Interview[];
  isDark: boolean;
}

const InterviewsTab: React.FC<InterviewsTabProps> = ({ interviews, isDark }) => {
  return (
    <div>
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className={`p-4 mb-4 rounded-lg border ${
            isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"
          }`}
        >
          <h3 className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {interview.title || interview.company}
          </h3>
          <p className={`${isDark ? "text-slate-300" : "text-slate-700"}`}>
            {interview.position || "N/A"} | {interview.date} | {interview.time || "N/A"}
          </p>
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Status: {interview.status} | Type: {interview.type || "N/A"} | Interviewer: {interview.interviewer || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InterviewsTab;
