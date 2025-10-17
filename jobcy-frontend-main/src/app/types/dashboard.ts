// src/app/types/dashboard.ts

export interface Education {
  id: number | string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string; // optional to match ProfileEditModal
}

export interface Experience {
  id: number | string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location: string;
  description?: string;
}

export interface Job {
  id: string; // force string to match JobsTab
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  applicants: number;
  description: string;
  hasApplied?: boolean;
  experienceLevel?: string; // "fresher" or "experienced"
  applicationDeadline?: string;
  qualifications?: string[];
}

export interface AppliedJob {
  id: string;
  jobId?: string;
  title: string;
  company: string;
  location?: string;
  salary?: string | number;
  type?: string;
  status?: string;
  appliedDate?: string;
}

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

export interface Interview {
  id: string;
  jobId?: string;
  company: string;
  date: string;
  status: string;
  position: string;
  time: string;
  type: string;
  interviewer: string;
  title?: string; // optional fallback
}

export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface Language {
  name: string;
  proficiency?: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  title?: string;
  mobile?: string;
  currentLocation?: string;
  experience?: string;
  currentCTC?: string;
  bio?: string;
  skills?: string[];
  projects?: Project[];
  languages?: Language[];
  education?: Education[];
  experienceList?: Experience[];
  profileCompletion?: number;
  connections?: number;
  dob?: string;
  gender?: string;
  category?: string;
  maritalStatus?: string;
  nationality?: string;
  resume?: string;
}
