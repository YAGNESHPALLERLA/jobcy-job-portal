import type { UserProfile, Education, Job, AppliedJob, Connection, Interview } from "@/app/types/dashboard";
import { Experience } from "@/app/types/type1";
export const mockProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  mobile: "+1 (555) 123-4567",
  currentLocation: "San Francisco, CA",
  title: "Frontend Developer",
  bio: "Passionate developer with 3+ years of experience",
  skills: ["React", "TypeScript", "Node.js", "Python"],
  // optional fields
  currentCTC: "15,00,000",
  experience: "3 years",
};


export const mockEducation: Education[] = [
  {
    id: "1",
    institution: "University of California",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    startDate: "2018-08",
    endDate: "2022-05",
  },
];

export const mockExperience: Experience[] = [
  {
    id: "1",
    company: "TechCorp Solutions",
    position: "Frontend Developer",
    startDate: "2023-01",
    endDate: "2026-01",
    current: true,
    location: "San Francisco, CA",
    description: "Building modern web applications",
  },
];


export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$140K - $180K",
    type: "Full-time",
    posted: "2 days ago",
    applicants: 45,
    description: "Join our team to build cutting-edge web apps",
  },
  {
    id: "2",
    title: "React Developer",
    company: "Meta",
    location: "Menlo Park, CA",
    salary: "$130K - $170K",
    type: "Full-time",
    posted: "5 days ago",
    applicants: 32,
    description: "Work on React ecosystem tools",
  },
];

export const mockAppliedJobs: AppliedJob[] = [
  {
    id: "1",
    jobId: "101",
    title: "Frontend Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$135K - $175K",
    type: "Full-time",
    status: "Under Review",
    appliedDate: "2024-09-15",
  },
];


export const mockConnections: Connection[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Senior Recruiter at Google",
    location: "Mountain View, CA",
    avatar: "SJ",
    connected: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    title: "Engineering Manager at Meta",
    location: "Menlo Park, CA",
    avatar: "MC",
    connected: false,
  },
  {
    id: "3",
    name: "Emily Davis",
    title: "Tech Lead at Amazon",
    location: "Seattle, WA",
    avatar: "ED",
    connected: true,
  },
];

export const mockInterviews: Interview[] = [
  {
    id: "1",
    company: "Google",
    date: "2024-10-15",
    status: "Scheduled",
    position: "Senior Frontend Developer",
    time: "2:00 PM PST",
    type: "Technical Interview",
    interviewer: "Sarah Johnson",
  },
];
