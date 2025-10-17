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
    experienceLevel: "experienced",
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
    experienceLevel: "experienced",
  },
  {
    id: "3",
    title: "Junior Frontend Developer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    salary: "$80K - $100K",
    type: "Full-time",
    posted: "1 day ago",
    applicants: 12,
    description: "Great opportunity for fresh graduates",
    experienceLevel: "fresher",
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
    experience: "5 years",
    education: "MBA",
    skills: ["Recruiting", "HR", "Talent Acquisition"],
    status: "employed",
    connected: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    title: "Engineering Manager at Meta",
    experience: "8 years",
    education: "MS Computer Science",
    skills: ["Leadership", "React", "Node.js", "Team Management"],
    status: "employed",
    connected: false,
  },
  {
    id: "3",
    name: "Emily Davis",
    title: "Tech Lead at Amazon",
    experience: "6 years",
    education: "BS Computer Science",
    skills: ["AWS", "Python", "Leadership", "System Design"],
    status: "employed",
    connected: true,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    experience: "4 years",
    education: "BS Software Engineering",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    status: "open",
    connected: false,
  },
  {
    id: "5",
    name: "Lisa Wang",
    title: "Product Manager",
    experience: "7 years",
    education: "MBA",
    skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
    status: "employed",
    connected: false,
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
