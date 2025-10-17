"use client";
import { Experience } from "@/app/types/type1";
import { Education, Project, Language, UserProfile } from "@/app/types/dashboard";

import {
  Edit,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Folder,
  User,
  Globe,
  DollarSign,
  Clock,
} from "lucide-react";
import ResumeUpload from "./ResumeUpload";

export type Skill = string;


// --- Props interface ---
interface ProfileTabProps {
  userProfile: UserProfile;
  education: Education[];
  experience: Experience[];
  isDark: boolean;
  onEditProfile: (section?: string) => void;
  updateProfile?: (data: Partial<UserProfile>) => Promise<{ success: boolean; message?: string; data?: UserProfile }>;
}
export default function ProfileTab({
  userProfile,
  education=[],
  experience=[],
  isDark,
  onEditProfile,
  updateProfile,
}:ProfileTabProps) {
  // Extract first letter from name for avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-5xl">
                {getInitial(userProfile.name)}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  } mb-1`}
                >
                  {userProfile.name}
                </h1>
                <p
                  className={`text-lg ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  } font-medium`}
                >
                  {userProfile.title}
                </p>
              </div>
              <button
                onClick={() => onEditProfile("personal")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center space-x-2">
                <Mail
                  className={`w-4 h-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {userProfile.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone
                  className={`w-4 h-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {userProfile.mobile}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin
                  className={`w-4 h-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {userProfile.currentLocation}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock
                  className={`w-4 h-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {userProfile.experience || "0 years"} Experience
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign
                  className={`w-4 h-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  ₹{userProfile.currentCTC || "Not disclosed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } rounded-xl border p-5 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                } mb-1`}
              >
                Profile Views
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                1,245
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div
          className={`${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } rounded-xl border p-5 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                } mb-1`}
              >
                Applications
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                28
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div
          className={`${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } rounded-xl border p-5 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                } mb-1`}
              >
                Profile Score
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                85%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            About Me
          </h3>
          <button
            onClick={() => onEditProfile("personal")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            Edit
          </button>
        </div>
        <p
          className={`${
            isDark ? "text-slate-300" : "text-slate-700"
          } leading-relaxed`}
        >
          {userProfile.bio ||
            "Add a brief description about yourself, your career goals, and what makes you unique."}
        </p>
      </div>

      {/* Resume Section */}
      <div className="mb-6">
        <ResumeUpload
          isDark={isDark}
          currentResume={userProfile.resume}
          onUploadSuccess={async (filePath) => {
            // Update the profile with the new resume path
            if (updateProfile) {
              await updateProfile({ resume: filePath });
            }
          }}
        />
      </div>

      {/* Skills Section */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Skills & Expertise
          </h3>
          <button
            onClick={() => onEditProfile("skills")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            + Add Skill
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {userProfile.skills?.map((skill: string, index: number) => (
  <span
    key={index}
    className={`px-4 py-2 ${
      isDark
        ? "bg-slate-700 text-slate-200 border-slate-600"
        : "bg-slate-50 text-slate-700 border-slate-200"
    } border rounded-lg text-sm font-medium hover:border-blue-500 transition-colors cursor-pointer`}
  >
    {skill}
  </span>
))}

        </div>
      </div>

      {/* Projects Section */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            } flex items-center`}
          >
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
              <Folder className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Projects
          </h3>
          <button
            onClick={() => onEditProfile("projects")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            + Add Project
          </button>
        </div>
        {userProfile.projects && userProfile.projects.length > 0 ? (
  <div className="space-y-6">
    {userProfile.projects.map((project: Project, index: number) => (
      <div
        key={index}
        className={`${index !== 0 ? "border-t pt-6" : ""} ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <h4
          className={`font-semibold text-lg ${
            isDark ? "text-white" : "text-slate-900"
          } mb-2`}
        >
          {project.title}
        </h4>
        <p
          className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"} mb-2`}
        >
          {project.description}
        </p>
        {project.link && (
          <a
            href={project.link}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Project →
          </a>
        )}
      </div>
    ))}
  </div>
) : (
  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
    Showcase your work by adding projects you have completed.
  </p>
)}

      </div>

      {/* Education Card */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            } flex items-center`}
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Education
          </h3>
          <button
            onClick={() => onEditProfile("education")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            + Add Education
          </button>
        </div>
        <div className="space-y-6">
          {education.map((edu: Education, index: number) => (
            <div
              key={edu.id || `edu-${index}`}
              className={`border-t pt-6 ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {edu.institution.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold text-lg ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {edu.degree} in {edu.fieldOfStudy}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                    {edu.institution}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <Calendar
                      className={`w-4 h-4 mr-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    />
                    <span
                      className={isDark ? "text-slate-400" : "text-slate-600"}
                    >
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Card */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            } flex items-center`}
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
              <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Work Experience
          </h3>
          <button
            onClick={() => onEditProfile("experience")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            + Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {experience.map((exp: Experience, index: number) => (
            <div
              key={exp.id || `exp-${index}`}
              className={`border-t pt-6 ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {exp.company.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold text-lg ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {exp.position}
                  </h4>
                  <p className="text-green-600 dark:text-green-400 font-medium mt-1">
                    {exp.company}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <Calendar
                      className={`w-4 h-4 mr-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    />
                    <span
                      className={isDark ? "text-slate-400" : "text-slate-600"}
                    >
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}{" "}
                      • {exp.location}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-3 leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Details Section */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 mb-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            } flex items-center`}
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            Personal Details
          </h3>
          <button
            onClick={() => onEditProfile("details")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div key="dob">
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              } mb-1 uppercase tracking-wide`}
            >
              Date of Birth
            </p>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {userProfile.dob || "Not provided"}
            </p>
          </div>
          <div key="gender">
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              } mb-1 uppercase tracking-wide`}
            >
              Gender
            </p>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {userProfile.gender || "Not specified"}
            </p>
          </div>
          <div key="category">
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              } mb-1 uppercase tracking-wide`}
            >
              Category
            </p>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {userProfile.category || "Not specified"}
            </p>
          </div>
          <div key="marital">
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              } mb-1 uppercase tracking-wide`}
            >
              Marital Status
            </p>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {userProfile.maritalStatus || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-xl border p-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            } flex items-center`}
          >
            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mr-3">
              <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            Languages
          </h3>
          <button
            onClick={() => onEditProfile("languages")}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            + Add Language
          </button>
        </div>
        {userProfile.languages && userProfile.languages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProfile.languages.map((lang: Language, index: number) => (
              <div
                key={`lang-${index}`}
                className={`p-4 ${
                  isDark ? "bg-slate-700" : "bg-slate-50"
                } rounded-lg`}
              >
                <p
                  className={`font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  } mb-1`}
                >
                  {lang.name}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {lang.proficiency || "Proficient"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Add languages you can speak or write.
          </p>
        )}
      </div>
    </div>
  );
}
