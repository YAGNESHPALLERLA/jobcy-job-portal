"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Education,
  Experience,
  Job,
  AppliedJob,
  Connection,
  Interview,
  UserProfile,
} from "@/app/types/dashboard";
import {
  mockProfile,
  mockEducation,
  mockExperience,
  mockJobs,
  mockAppliedJobs,
  mockConnections,
  mockInterviews,
} from "../utils/mockData";

type UserProfileUpdate = Partial<UserProfile>;

interface RawJob {
  id?: string;
  _id?: string;
  title: string;
  company: string;
  location?: string;
  salary?: number | string;
  type?: string;
  posted?: string;
  applicants?: number;
  description?: string;
  hasApplied?: boolean;
  experienceLevel?: string;
  careerLevel?: string;
  applicationDeadline?: string;
  qualifications?: string[];
}

interface RawUser {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
  title?: string;
  professionalRole?: string;
  currentLocation?: string;
  location?: string;
  company?: { location?: string };
  experience?: string;
  education?: string;
  skills?: string[];
  status?: string;
}

interface RawInterview {
  id?: string | number;
  _id?: string | number;
  jobId?: string | number;
  company?: string;
  date?: string;
  status?: string;
  position?: string;
  title?: string;
  time?: string;
  type?: string;
  interviewer?: string;
}

interface ConnectedUser {
  id: string;
  name: string;
  title: string;
  experience?: string;
  education?: string;
  skills?: string[];
  status?: string;
  connected: boolean;
}

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: "" });
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  // ✅ Helper for mock fallback
  const applyMockData = () => {
    setUserProfile(mockProfile);
    setEducation(mockEducation);
    setExperience(mockExperience);
    setAllJobs(mockJobs);
    setAppliedJobs(mockAppliedJobs);
    setConnections(mockConnections);
    setInterviews(mockInterviews);
  };

  // ✅ Common function to fetch dashboard data (called on mount and token change)
  const fetchDashboardData = useCallback(async (token: string) => {
    try {
      // Check user role - only fetch for regular users
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role !== "user") {
            console.log("⚠️ Not a user role, skipping user dashboard data fetch");
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }

      setIsLoading(true);

      // Fetch profile
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileRes.ok) {
        console.error("Profile fetch failed with status:", profileRes.status);
        throw new Error("Profile fetch failed");
      }
      const profileData = await profileRes.json();

      const mappedProfile: UserProfile = {
        name: profileData.name || "",
        email: profileData.email,
        mobile: profileData.mobile,
        title: profileData.professionalRole || profileData.title,
        currentLocation: profileData.currentLocation,
        experience: profileData.experience,
        currentCTC: profileData.currentCTC
          ? String(profileData.currentCTC)
          : undefined,
        bio: profileData.bio,
        skills: profileData.skills,
        projects: profileData.projects,
        languages: profileData.languages,
        education: profileData.education || [],
        experienceList: profileData.experienceList || [],
        profileCompletion: profileData.profileCompletion,
        connections: profileData.connections,
        dob: profileData.personalDetails?.[0]?.dob,
        gender: profileData.personalDetails?.[0]?.gender,
        category: profileData.personalDetails?.[0]?.category,
        maritalStatus: profileData.personalDetails?.[0]?.maritalStatus,
        resume: profileData.resume?.name,
      };

      setUserProfile(mappedProfile);
      setEducation(mappedProfile.education || []);
      setExperience(mappedProfile.experienceList || []);

      // Fetch experience separately
      const experienceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/experience`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (experienceRes.ok) {
        const experienceData = await experienceRes.json();
        setExperience(experienceData);
      }

      // Fetch jobs
      const jobsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/browse`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setAllJobs(
          jobsData.map((job: RawJob) => ({
            id: job.id || job._id || Math.random().toString(),
            title: job.title,
            company: job.company,
            location: job.location || "Location not specified",
            salary:
              typeof job.salary === "number"
                ? `$${job.salary.toLocaleString()}`
                : job.salary || "Salary not disclosed",
            type: job.type || "Full-time",
            posted: job.posted
              ? new Date(job.posted).toLocaleDateString()
              : "Recently posted",
            applicants: job.applicants || 0,
            description: job.description || "No description available",
            hasApplied: job.hasApplied || false,
            experienceLevel: job.careerLevel || job.experienceLevel, // Map from backend's careerLevel field
            applicationDeadline: job.applicationDeadline,
            qualifications: job.qualifications,
          }))
        );
      }

      // Fetch connections
      const connectionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (connectionsRes.ok) {
        const usersData = await connectionsRes.json();
        setConnections(
          usersData.map((u: RawUser) => ({
            id: u._id || u.id || Math.random().toString(),
            name: u.name || "Unknown User",
            title: u.professionalRole || u.role || u.title || "Job Seeker",
            experience: u.experience || "Not specified",
            education: u.education || "Not specified",
            skills: u.skills || [],
            status: u.status || "employed",
            connected: false,
          }))
        );
      }

      // Fetch connected users for chat
      const connectedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/connections/connections`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (connectedRes.ok) {
        const connectedData = await connectedRes.json();
        const connectedUsers = connectedData.map((u: ConnectedUser) => ({
          id: u.id || Math.random().toString(),
          name: u.name || "Unknown User",
          title: u.title || "Job Seeker",
          experience: u.experience || "Not specified",
          education: u.education || "Not specified",
          skills: u.skills || [],
          status: u.status || "employed",
          connected: true,
        }));

        // Merge connected users with existing connections
        setConnections(prevConnections => {
          const existingIds = new Set(prevConnections.map(c => c.id));
          const newConnections = connectedUsers.filter((c: Connection) => !existingIds.has(c.id));
          return [...prevConnections, ...newConnections];
        });
      }

      // Fetch applied jobs
      const appliedJobsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (appliedJobsRes.ok) {
        const appliedJobsData = await appliedJobsRes.json();
        setAppliedJobs(appliedJobsData);
      }

      // Fetch interviews
      const interviewsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/interviews`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (interviewsRes.ok) {
        const interviewsData = await interviewsRes.json();
        setInterviews(
          interviewsData.map((int: RawInterview) => ({
            id: String(int.id || int._id || Math.random()),
            jobId: int.jobId ? String(int.jobId) : undefined,
            company: int.company || "Unknown Company",
            date: int.date || new Date().toISOString().split("T")[0],
            status: int.status || "Scheduled",
            position: int.position || int.title || "Not specified",
            time: int.time || "Time not specified",
            type: int.type || "Interview",
            interviewer: int.interviewer || "Not assigned",
          }))
        );
      }
    } catch (error) {
      console.error("❌ Dashboard fetch error:", error);
      
      // Only apply mock data if we're actually a user (not HR/admin)
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === "user") {
            console.log("📊 Using mock data as fallback for user");
            applyMockData();
            setUseMockData(true);
          }
        } catch (parseError) {
          console.error("Error parsing user:", parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Run when dashboard mounts OR when token appears after login
  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("userToken");
    if (!token) {
      applyMockData();
      setUseMockData(true);
      setIsLoading(false);
      return;
    }
    fetchDashboardData(token);
  }, [fetchDashboardData]);

  // ✅ Make sure event handlers never break
  const handleJobApplication = async (jobId: string | number) => {
    if (!allJobs.length) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for job application");
        return;
      }

      // Call the backend API to apply for the job
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coverLetter: "" }), // Optional cover letter
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Job application successful:", result);

        // Update local state
        setAllJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId
              ? { ...job, hasApplied: true, applicants: (job.applicants || 0) + 1 }
              : job
          )
        );

        // Refresh applied jobs data
        const appliedJobsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (appliedJobsRes.ok) {
          const appliedJobsData = await appliedJobsRes.json();
          setAppliedJobs(appliedJobsData);
        }
      } else {
        const errorData = await response.json();
        console.error("Job application failed:", errorData);
        alert(`Application failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job. Please try again.");
    }
  };

  const updateProfile = async (formData: UserProfileUpdate) => {
    const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "No token found" };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        const mappedProfile: UserProfile = {
          name: data.name || "",
          email: data.email,
          mobile: data.mobile,
          title: data.professionalRole || data.title,
          currentLocation: data.currentLocation,
          experience: data.experience,
          currentCTC: data.currentCTC ? String(data.currentCTC) : undefined,
          bio: data.bio,
          skills: data.skills,
          projects: data.projects || [],
          languages: data.languages || [],
          education: data.education || [],
          experienceList: data.experienceList || [],
          profileCompletion: data.profileCompletion,
          connections: data.connections,
          dob: data.personalDetails?.[0]?.dob,
          gender: data.personalDetails?.[0]?.gender,
          category: data.personalDetails?.[0]?.category,
          maritalStatus: data.personalDetails?.[0]?.maritalStatus,
          nationality: data.personalDetails?.[0]?.nationality,
          resume: data.resume?.name,
        };
        setUserProfile(mappedProfile);
        return { success: true, data: mappedProfile };
      } else {
        return { success: false, message: data.message || "Update failed" };
      }
    } catch (err) {
      console.error("Profile update error:", err);
      return { success: false, message: "Network error" };
    }
  };

  return {
    isLoading,
    userProfile,
    education,
    experience,
    allJobs,
    appliedJobs,
    connections,
    interviews,
    updateProfile,
    useMockData,
    handleJobApplication,
    refetch: () => {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (token) fetchDashboardData(token);
    },
  };
}
