"use client";

import { useEffect, useState } from "react";
import { X, Save, User, Briefcase, GraduationCap, Folder, FileText, Globe, Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { UserProfile, Education, Experience, Project, Language } from "@/app/types/dashboard";

interface ProfileEditModalProps {
  userProfile: UserProfile;
  experience: Experience[];
  isDark?: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => Promise<{ success: boolean; message?: string }>;
  initialSection?: string;
}

interface EducationFormProps {
  education: Education | null;
  onSave: (data: Omit<Education, 'id'>) => Promise<void>;
  onCancel: () => void;
  isDark?: boolean;
}

interface ExperienceFormProps {
  experience: Experience | null;
  onSave: (data: Omit<Experience, 'id'>) => Promise<void>;
  onCancel: () => void;
  isDark?: boolean;
}

interface ProjectFormProps {
  project: Project | null;
  onSave: (data: Project) => Promise<void>;
  onCancel: () => void;
  isDark?: boolean;
}

interface LanguageFormProps {
  language: Language | null;
  onSave: (data: Language) => Promise<void>;
  onCancel: () => void;
  isDark?: boolean;
}

// Education Form Component
function EducationForm({ education, onSave, onCancel, isDark = false }: EducationFormProps) {
  const [formData, setFormData] = useState({
    institution: education?.institution || "",
    degree: education?.degree || "",
    fieldOfStudy: education?.fieldOfStudy || "",
    startDate: education?.startDate || "",
    endDate: education?.endDate || "",
    grade: education?.grade || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree || !formData.fieldOfStudy || !formData.startDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Prepare data, excluding empty fields
    const submitData: Partial<Omit<Education, 'id'>> = {
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      startDate: formData.startDate,
    };

    if (formData.endDate) {
      submitData.endDate = formData.endDate;
    }

    if (formData.grade) {
      submitData.grade = formData.grade;
    }

    await onSave(submitData as Omit<Education, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Institution *
        </label>
        <input
          type="text"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. Harvard University"
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Degree *
        </label>
        <input
          type="text"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. Bachelor of Science"
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Field of Study *
        </label>
        <input
          type="text"
          value={formData.fieldOfStudy}
          onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. Computer Science"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
            }`}
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
            }`}
          />
        </div>
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Grade
        </label>
        <input
          type="text"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. 3.8 GPA or First Class"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
              : "text-slate-700 bg-slate-100 hover:bg-slate-200"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {education ? "Update" : "Add"} Education
        </button>
      </div>
    </form>
  );
}

// Experience Form Component
function ExperienceForm({ experience, onSave, onCancel, isDark = false }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    company: experience?.company || "",
    position: experience?.position || "",
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    current: experience?.current || false,
    location: experience?.location || "",
    description: experience?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position || !formData.startDate || !formData.location) {
      alert("Please fill in all required fields");
      return;
    }
    const submitData: Omit<Experience, 'id'> = {
      company: formData.company,
      position: formData.position,
      startDate: formData.startDate,
      location: formData.location,
      current: formData.current,
      description: formData.description,
      endDate: formData.current ? undefined : formData.endDate || undefined,
    };
    await onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Company *
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. Google Inc."
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Position *
        </label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. Software Engineer"
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Location *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. San Francisco, CA"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
            }`}
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            disabled={formData.current}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500 disabled:opacity-50"
                : "bg-white border-slate-300 text-slate-900 focus:border-blue-500 disabled:opacity-50"
            }`}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="current"
          checked={formData.current}
          onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? "" : formData.endDate })}
          className="rounded"
        />
        <label htmlFor="current" className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          I currently work here
        </label>
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="Describe your responsibilities and achievements..."
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
              : "text-slate-700 bg-slate-100 hover:bg-slate-200"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {experience ? "Update" : "Add"} Experience
        </button>
      </div>
    </form>
  );
}

// Project Form Component
function ProjectForm({ project, onSave, onCancel, isDark = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    link: project?.link || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Project Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. E-commerce Website"
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="Describe your project..."
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Project Link
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="https://github.com/username/project"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
              : "text-slate-700 bg-slate-100 hover:bg-slate-200"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {project ? "Update" : "Add"} Project
        </button>
      </div>
    </form>
  );
}

// Language Form Component
function LanguageForm({ language, onSave, onCancel, isDark = false }: LanguageFormProps) {
  const [formData, setFormData] = useState({
    name: language?.name || "",
    proficiency: language?.proficiency || "",
  });

  const proficiencyOptions = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Native",
    "Fluent"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please fill in the language name");
      return;
    }
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Language *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
          }`}
          placeholder="e.g. English"
          required
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Proficiency Level
        </label>
        <select
          value={formData.proficiency}
          onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
          }`}
        >
          <option value="">Select proficiency</option>
          {proficiencyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
              : "text-slate-700 bg-slate-100 hover:bg-slate-200"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {language ? "Update" : "Add"} Language
        </button>
      </div>
    </form>
  );
}

// --- Component ---
export default function ProfileEditModal({
  userProfile,
  experience,
  isDark = false,
  onClose,
  onSave,
  initialSection = "personal",
}: ProfileEditModalProps) {
  const [editingProfile, setEditingProfile] = useState<UserProfile>({ ...userProfile });
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [education, setEducation] = useState<Education[]>([]);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [modalExperience, setModalExperience] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);

  useEffect(() => {
    setEditingProfile({ ...userProfile });
    setEducation(userProfile.education || []);
    setProjects(userProfile.projects || []);
    setLanguages(userProfile.languages || []);
    setModalExperience(experience || []);
    setSkills(userProfile.skills || []);
  }, [userProfile, experience]);



  // All profile sections have been implemented (education, projects, languages, personal details)


  // ===== Save Handler =====
  const handleSave = async () => {
    const profileData = {
      ...editingProfile,
      education,
      projects,
      languages,
      skills,
    };
    const result = await onSave(profileData);
    if (result.success) {
      onClose();
    } else {
      alert(result.message || "Update failed");
    }
  };


  // ===== Experience CRUD Functions =====
  const addExperience = async (expData: Omit<Experience, 'id'>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expData),
      });
      if (response.ok) {
        const newExp = await response.json();
        setModalExperience([...modalExperience, newExp]);
      } else {
        alert("Failed to add experience");
      }
    } catch (error) {
      console.error("Add experience error:", error);
      alert("Failed to add experience");
    }
  };

  const updateExperience = async (id: string | number, expData: Partial<Experience>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expData),
      });
      if (response.ok) {
        const updatedExp = await response.json();
        setModalExperience(modalExperience.map(exp => exp.id === id ? updatedExp : exp));
      } else {
        alert("Failed to update experience");
      }
    } catch (error) {
      console.error("Update experience error:", error);
      alert("Failed to update experience");
    }
  };

  const deleteExperience = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setModalExperience(modalExperience.filter(exp => exp.id !== id));
      } else {
        alert("Failed to delete experience");
      }
    } catch (error) {
      console.error("Delete experience error:", error);
      alert("Failed to delete experience");
    }
  };

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "skills", label: "Skills", icon: TrendingUp },
    { id: "details", label: "Personal Details", icon: FileText },
    { id: "languages", label: "Languages", icon: Globe },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDark ? "bg-slate-800" : "bg-white"
        } rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex`}
      >
        {/* Sidebar Navigation */}
        <div
          className={`w-64 ${
            isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
          } border-r p-4`}
        >
          <div className="mb-6">
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Edit Profile
            </h3>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Update your information
            </p>
          </div>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-r from-slate-700 to-slate-800 border-slate-700"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-slate-200"
            } p-6 border-b flex items-center justify-between`}
          >
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {sections.find((s) => s.id === activeSection)?.label}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-slate-400 hover:bg-slate-700 hover:text-white"
                  : "text-slate-500 hover:bg-white hover:text-slate-700"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editingProfile.name || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingProfile.email || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Mobile
                    </label>
                    <input
                      type="tel"
                      value={editingProfile.mobile || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, mobile: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                      }`}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingProfile.title || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                      }`}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Current Location
                    </label>
                    <input
                      type="text"
                      value={editingProfile.currentLocation || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, currentLocation: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                      }`}
                      placeholder="e.g. New York, NY"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Current CTC
                    </label>
                    <input
                      type="text"
                      value={editingProfile.currentCTC || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, currentCTC: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                      }`}
                      placeholder="e.g. $80,000"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Bio
                  </label>
                  <textarea
                    value={editingProfile.bio || ""}
                    onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}
            {activeSection === "education" && (
              <div className="space-y-6">
                {/* Education List */}
                    <div className="space-y-4">
                      {education.length === 0 ? (
                        <p className={`text-center py-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          No education entries yet. Add your first education below.
                        </p>
                      ) : (
                        education.map((edu, index) => (
                          <div
                            key={edu.id || `edu-${index}`}
                            className={`p-4 rounded-lg border ${
                              isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-300"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                                  {edu.degree} in {edu.fieldOfStudy}
                                </h4>
                                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                  {edu.institution}
                                </p>
                                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                  {edu.startDate} - {edu.endDate || "Present"}
                                  {edu.grade && ` • Grade: ${edu.grade}`}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingEducation(edu);
                                    setShowEducationForm(true);
                                  }}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDark ? "text-slate-400 hover:bg-slate-600" : "text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this education entry?")) {
                                      setEducation(education.filter(e => e.id !== edu.id));
                                    }
                                  }}
                                  className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Education Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setEditingEducation(null);
                          setShowEducationForm(true);
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isDark
                            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Education</span>
                      </button>
                    </div>

                    {/* Education Form Modal */}
                    {showEducationForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div
                          className={`${
                            isDark ? "bg-slate-800" : "bg-white"
                          } rounded-2xl max-w-md w-full p-6 shadow-2xl`}
                        >
                          <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                            {editingEducation ? "Edit Education" : "Add Education"}
                          </h3>
                          <EducationForm
                            education={editingEducation}
                            onSave={async (eduData) => {
                              if (editingEducation) {
                                // Update existing education
                                const index = education.findIndex(edu => edu === editingEducation);
                                if (index !== -1) {
                                  const newEducation = [...education];
                                  newEducation[index] = { ...eduData, id: editingEducation.id };
                                  setEducation(newEducation);
                                }
                              } else {
                                // Add new education
                                const newEdu = { ...eduData, id: Date.now().toString() };
                                setEducation([...education, newEdu]);
                              }
                              setShowEducationForm(false);
                              setEditingEducation(null);
                            }}
                            onCancel={() => {
                              setShowEducationForm(false);
                              setEditingEducation(null);
                            }}
                            isDark={isDark}
                          />
                        </div>
                      </div>
                    )}
                </div>
            )}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <>
                    {/* Experience List */}
                    <div className="space-y-4">
                      {modalExperience.length === 0 ? (
                        <p className={`text-center py-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          No experience entries yet. Add your first experience below.
                        </p>
                      ) : (
                        modalExperience.map((exp, index) => (
                          <div
                            key={exp.id || `exp-${index}`}
                            className={`p-4 rounded-lg border ${
                              isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-300"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                                  {exp.position} at {exp.company}
                                </h4>
                                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                  {exp.location}
                                </p>
                                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </p>
                                {exp.description && (
                                  <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingExperience(exp);
                                    setShowExperienceForm(true);
                                  }}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDark ? "text-slate-400 hover:bg-slate-600" : "text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteExperience(exp.id)}
                                  className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Experience Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setEditingExperience(null);
                          setShowExperienceForm(true);
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isDark
                            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Experience</span>
                      </button>
                    </div>

                    {/* Experience Form Modal */}
                    {showExperienceForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div
                          className={`${
                            isDark ? "bg-slate-800" : "bg-white"
                          } rounded-2xl max-w-md w-full p-6 shadow-2xl`}
                        >
                          <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                            {editingExperience ? "Edit Experience" : "Add Experience"}
                          </h3>
                          <ExperienceForm
                            experience={editingExperience}
                            onSave={async (expData) => {
                              if (editingExperience) {
                                await updateExperience(editingExperience.id, expData);
                              } else {
                                await addExperience(expData);
                              }
                              setShowExperienceForm(false);
                              setEditingExperience(null);
                            }}
                            onCancel={() => {
                              setShowExperienceForm(false);
                              setEditingExperience(null);
                            }}
                            isDark={isDark}
                          />
                        </div>
                      </div>
                    )}
                </>
              </div>
            )}
            {activeSection === "projects" && (
              <div className="space-y-6">
                {/* Projects List */}
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className={`text-center py-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      No projects yet. Add your first project below.
                    </p>
                  ) : (
                    projects.map((project, index) => (
                      <div
                        key={`project-${index}-${project.title}`}
                        className={`p-4 rounded-lg border ${
                          isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {project.title}
                            </h4>
                            <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {project.description}
                            </p>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block"
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingProject(project);
                                setShowProjectForm(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                isDark ? "text-slate-400 hover:bg-slate-600" : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this project?")) {
                                  setProjects(projects.filter((_, i) => i !== index));
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Project Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setShowProjectForm(true);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {/* Project Form Modal */}
                {showProjectForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div
                      className={`${
                        isDark ? "bg-slate-800" : "bg-white"
                      } rounded-2xl max-w-md w-full p-6 shadow-2xl`}
                    >
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {editingProject ? "Edit Project" : "Add Project"}
                      </h3>
                      <ProjectForm
                        project={editingProject}
                        onSave={async (projectData) => {
                          if (editingProject) {
                            // Update existing project
                            const index = projects.findIndex(p => p === editingProject);
                            if (index !== -1) {
                              const newProjects = [...projects];
                              newProjects[index] = projectData;
                              setProjects(newProjects);
                            }
                          } else {
                            // Add new project
                            setProjects([...projects, projectData]);
                          }
                          setShowProjectForm(false);
                          setEditingProject(null);
                        }}
                        onCancel={() => {
                          setShowProjectForm(false);
                          setEditingProject(null);
                        }}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeSection === "details" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Gender
                    </label>
                    <select
                      value={editingProfile.gender || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, gender: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Category
                    </label>
                    <select
                      value={editingProfile.category || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, category: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Marital Status
                    </label>
                    <select
                      value={editingProfile.maritalStatus || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, maritalStatus: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select marital status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editingProfile.dob || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, dob: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={editingProfile.nationality || ""}
                    onChange={(e) => setEditingProfile({ ...editingProfile, nationality: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                    }`}
                    placeholder="e.g. Indian"
                  />
                </div>
              </div>
            )}
            {activeSection === "skills" && (
              <div className="space-y-6">
                {/* Skills List */}
                <div className="space-y-4">
                  {skills.length === 0 ? (
                    <p className={`text-center py-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      No skills yet. Add your first skill below.
                    </p>
                  ) : (
                    skills.map((skill, index) => (
                      <div
                        key={`skill-${index}-${skill}`}
                        className={`p-4 rounded-lg border ${
                          isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {skill}
                            </h4>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingSkill(skill);
                                setShowSkillForm(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                isDark ? "text-slate-400 hover:bg-slate-600" : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this skill?")) {
                                  setSkills(skills.filter((_, i) => i !== index));
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Skill Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setEditingSkill(null);
                      setShowSkillForm(true);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                {/* Skill Form Modal */}
                {showSkillForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div
                      className={`${
                        isDark ? "bg-slate-800" : "bg-white"
                      } rounded-2xl max-w-md w-full p-6 shadow-2xl`}
                    >
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {editingSkill ? "Edit Skill" : "Add Skill"}
                      </h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target as HTMLFormElement);
                          const skillName = formData.get("skill") as string;
                          if (skillName.trim()) {
                            if (editingSkill) {
                              const index = skills.findIndex(s => s === editingSkill);
                              if (index !== -1) {
                                const newSkills = [...skills];
                                newSkills[index] = skillName.trim();
                                setSkills(newSkills);
                              }
                            } else {
                              setSkills([...skills, skillName.trim()]);
                            }
                            setShowSkillForm(false);
                            setEditingSkill(null);
                          }
                        }}
                      >
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            Skill Name *
                          </label>
                          <input
                            type="text"
                            name="skill"
                            defaultValue={editingSkill || ""}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                              isDark
                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                            }`}
                            placeholder="e.g. JavaScript"
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSkillForm(false);
                              setEditingSkill(null);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              isDark
                                ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
                                : "text-slate-700 bg-slate-100 hover:bg-slate-200"
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            {editingSkill ? "Update" : "Add"} Skill
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeSection === "languages" && (
              <div className="space-y-6">
                {/* Languages List */}
                <div className="space-y-4">
                  {languages.length === 0 ? (
                    <p className={`text-center py-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      No languages yet. Add your first language below.
                    </p>
                  ) : (
                    languages.map((language, index) => (
                      <div
                        key={`language-${index}-${language.name}`}
                        className={`p-4 rounded-lg border ${
                          isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {language.name}
                            </h4>
                            {language.proficiency && (
                              <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                Proficiency: {language.proficiency}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingLanguage(language);
                                setShowLanguageForm(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                isDark ? "text-slate-400 hover:bg-slate-600" : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this language?")) {
                                  setLanguages(languages.filter((_, i) => i !== index));
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Language Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setEditingLanguage(null);
                      setShowLanguageForm(true);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Language</span>
                  </button>
                </div>

                {/* Language Form Modal */}
                {showLanguageForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div
                      className={`${
                        isDark ? "bg-slate-800" : "bg-white"
                      } rounded-2xl max-w-md w-full p-6 shadow-2xl`}
                    >
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {editingLanguage ? "Edit Language" : "Add Language"}
                      </h3>
                      <LanguageForm
                        language={editingLanguage}
                        onSave={async (languageData) => {
                          if (editingLanguage) {
                            // Update existing language
                            const index = languages.findIndex(l => l === editingLanguage);
                            if (index !== -1) {
                              const newLanguages = [...languages];
                              newLanguages[index] = languageData;
                              setLanguages(newLanguages);
                            }
                          } else {
                            // Add new language
                            setLanguages([...languages, languageData]);
                          }
                          setShowLanguageForm(false);
                          setEditingLanguage(null);
                        }}
                        onCancel={() => {
                          setShowLanguageForm(false);
                          setEditingLanguage(null);
                        }}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-end space-x-3 p-6 border-t ${
              isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
            }`}
          >
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                isDark
                  ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
                  : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
