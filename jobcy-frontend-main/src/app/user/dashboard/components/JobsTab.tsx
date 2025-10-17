// src/app/user/dashboard/components/JobsTab.tsx
"use client";

import React, { useState } from "react";
import { Job } from "@/app/types/dashboard";
import { Briefcase, GraduationCap, Users, Calendar, Clock } from "lucide-react";

interface JobsTabProps {
  allJobs: Job[];
  isDark: boolean;
  onApplyJob: (jobId: string) => void;
}

type FilterType = 'all' | 'fresher' | 'experienced';

const JobsTab: React.FC<JobsTabProps> = ({ allJobs, isDark, onApplyJob }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  // Filter jobs based on active filter
  const filteredJobs = allJobs.filter(job => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'fresher') return job.experienceLevel?.toLowerCase() === 'fresher';
    if (activeFilter === 'experienced') return job.experienceLevel?.toLowerCase() === 'experienced';
    return true;
  });

  // Count jobs by category
  const fresherCount = allJobs.filter(job => job.experienceLevel?.toLowerCase() === 'fresher').length;
  const experiencedCount = allJobs.filter(job => job.experienceLevel?.toLowerCase() === 'experienced').length;

  return (
    <div>
      {/* Filter Tabs */}
      <div className={`mb-6 p-4 rounded-xl ${isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200"} shadow-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
          Available Jobs
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeFilter === 'all'
                ? isDark
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-500 text-white shadow-lg"
                : isDark
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Jobs</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'all'
                ? "bg-white/20"
                : isDark ? "bg-slate-600" : "bg-slate-200"
            }`}>
              {allJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('fresher')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeFilter === 'fresher'
                ? isDark
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-green-500 text-white shadow-lg"
                : isDark
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Fresher</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'fresher'
                ? "bg-white/20"
                : isDark ? "bg-slate-600" : "bg-slate-200"
            }`}>
              {fresherCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('experienced')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeFilter === 'experienced'
                ? isDark
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-purple-500 text-white shadow-lg"
                : isDark
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Experienced</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'experienced'
                ? "bg-white/20"
                : isDark ? "bg-slate-600" : "bg-slate-200"
            }`}>
              {experiencedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`p-5 rounded-xl border ${
                isDark ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50" : "bg-white border-slate-200 hover:shadow-lg"
              } transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>{job.title}</h3>
                    {job.experienceLevel && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.experienceLevel.toLowerCase() === 'fresher'
                          ? isDark 
                            ? "bg-green-900/30 text-green-400 border border-green-800"
                            : "bg-green-100 text-green-700 border border-green-200"
                          : isDark
                            ? "bg-purple-900/30 text-purple-400 border border-purple-800"
                            : "bg-purple-100 text-purple-700 border border-purple-200"
                      }`}>
                        {job.experienceLevel.toLowerCase() === 'fresher' ? (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            Fresher
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            Experienced
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <p className={`${isDark ? "text-slate-300" : "text-slate-700"} mb-2`}>
                    <span className="font-medium">{job.company}</span> • {job.location}
                  </p>
                </div>
              </div>
              <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm mb-4 line-clamp-2`}>{job.description}</p>
              
              {/* Application Deadline Badge */}
              {job.applicationDeadline && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${
                  (() => {
                    const deadline = new Date(job.applicationDeadline);
                    const today = new Date();
                    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    if (daysLeft < 0) {
                      return isDark ? "bg-red-900/30 border border-red-800" : "bg-red-50 border border-red-200";
                    } else if (daysLeft <= 3) {
                      return isDark ? "bg-orange-900/30 border border-orange-800" : "bg-orange-50 border border-orange-200";
                    } else {
                      return isDark ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200";
                    }
                  })()
                }`}>
                  <Clock className={`w-4 h-4 ${
                    (() => {
                      const deadline = new Date(job.applicationDeadline);
                      const today = new Date();
                      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (daysLeft < 0) {
                        return isDark ? "text-red-400" : "text-red-600";
                      } else if (daysLeft <= 3) {
                        return isDark ? "text-orange-400" : "text-orange-600";
                      } else {
                        return isDark ? "text-blue-400" : "text-blue-600";
                      }
                    })()
                  }`} />
                  <span className={`text-xs font-semibold ${
                    (() => {
                      const deadline = new Date(job.applicationDeadline);
                      const today = new Date();
                      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (daysLeft < 0) {
                        return isDark ? "text-red-400" : "text-red-600";
                      } else if (daysLeft <= 3) {
                        return isDark ? "text-orange-400" : "text-orange-600";
                      } else {
                        return isDark ? "text-blue-400" : "text-blue-600";
                      }
                    })()
                  }`}>
                    {(() => {
                      const deadline = new Date(job.applicationDeadline);
                      const today = new Date();
                      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (daysLeft < 0) {
                        return "Deadline passed";
                      } else if (daysLeft === 0) {
                        return "Last day to apply!";
                      } else if (daysLeft === 1) {
                        return "Apply today - 1 day left";
                      } else if (daysLeft <= 3) {
                        return `Hurry! ${daysLeft} days left`;
                      } else if (daysLeft <= 7) {
                        return `Deadline: ${daysLeft} days left`;
                      } else {
                        return `Apply by ${new Date(job.applicationDeadline).toLocaleDateString()}`;
                      }
                    })()}
                  </span>
                </div>
              )}
              
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleViewDetails(job)}
                  className={`px-3 py-1 rounded-lg ${
                    isDark ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  View Details
                </button>
                <button
                  disabled={job.hasApplied}
                  onClick={() => onApplyJob(job.id)}
                  className={`px-3 py-1 rounded-lg ${
                    job.hasApplied
                      ? "bg-gray-500 cursor-not-allowed"
                      : isDark
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {job.hasApplied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${
          isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200"
        } rounded-xl`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          } flex items-center justify-center`}>
            {activeFilter === 'fresher' ? (
              <GraduationCap className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            ) : activeFilter === 'experienced' ? (
              <Briefcase className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            ) : (
              <Users className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            )}
          </div>
          <p className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            No {activeFilter === 'all' ? '' : activeFilter === 'fresher' ? 'Fresher' : 'Experienced'} Jobs Available
          </p>
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {activeFilter === 'all' 
              ? 'Check back later for new opportunities.' 
              : `Try filtering by "${activeFilter === 'fresher' ? 'All Jobs' : 'All Jobs'}" to see more options.`
            }
          </p>
        </div>
      )}

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${isDark ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                {selectedJob.experienceLevel && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    selectedJob.experienceLevel.toLowerCase() === 'fresher'
                      ? isDark 
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : "bg-green-100 text-green-700 border border-green-200"
                      : isDark
                        ? "bg-purple-900/30 text-purple-400 border border-purple-800"
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                  }`}>
                    {selectedJob.experienceLevel.toLowerCase() === 'fresher' ? (
                      <>
                        <GraduationCap className="w-3.5 h-3.5" />
                        Fresher Position
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-3.5 h-3.5" />
                        Experienced Position
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{selectedJob.company}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`flex items-center space-x-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      📍 {selectedJob.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                    {selectedJob.salary}
                  </span>
                  <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    💼 {selectedJob.type}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className={`${isDark ? "text-slate-300" : "text-slate-700"}`}>{selectedJob.description}</p>
              </div>

              {/* Application Deadline - Prominent Display */}
              {selectedJob.applicationDeadline && (
                <div className={`p-4 rounded-xl border-2 ${
                  isDark 
                    ? "bg-orange-900/20 border-orange-800" 
                    : "bg-orange-50 border-orange-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDark ? "bg-orange-800/50" : "bg-orange-200"
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        isDark ? "text-orange-400" : "text-orange-700"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${
                        isDark ? "text-orange-400" : "text-orange-700"
                      } uppercase tracking-wide`}>
                        Application Deadline
                      </p>
                      <p className={`text-lg font-bold ${
                        isDark ? "text-orange-300" : "text-orange-800"
                      }`}>
                        {new Date(selectedJob.applicationDeadline).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className={`text-xs ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      } mt-1`}>
                        {(() => {
                          const deadline = new Date(selectedJob.applicationDeadline);
                          const today = new Date();
                          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          
                          if (daysLeft < 0) {
                            return "⚠️ Deadline has passed";
                          } else if (daysLeft === 0) {
                            return "⏰ Last day to apply!";
                          } else if (daysLeft === 1) {
                            return "⏰ 1 day left to apply";
                          } else if (daysLeft <= 7) {
                            return `⏰ ${daysLeft} days left to apply`;
                          } else {
                            return `📅 ${daysLeft} days left to apply`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`flex items-center flex-wrap gap-4 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted: {selectedJob.posted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedJob.applicants} applicants
                </span>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  disabled={selectedJob.hasApplied}
                  onClick={() => {
                    onApplyJob(selectedJob.id);
                    closeModal();
                  }}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    selectedJob.hasApplied
                      ? "bg-gray-500 cursor-not-allowed text-white"
                      : isDark
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {selectedJob.hasApplied ? "Already Applied" : "Apply Now"}
                </button>
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isDark ? "bg-slate-600 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsTab;
