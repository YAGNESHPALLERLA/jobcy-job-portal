"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Mail,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

interface Company {
  _id: string;
  id?: string;
  name: string;
  email: string;
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
  size?: string;
  status: string;
  registeredBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function CompanyManagement() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isDarkMode = false; // Light mode only for company management
  
  // View Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<{
    company: Company | null;
    hrs: Array<{ _id: string; name: string; email: string; mobile?: number }>;
    jobs: Array<{ _id: string; title: string; applicants: number }>;
    applications: Array<{
      _id: string;
      userId: { name: string; email: string };
      jobId: { title: string };
      status: string;
      createdAt: string;
    }>;
  }>({
    company: null,
    hrs: [],
    jobs: [],
    applications: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    industry: "",
    location: "",
    website: "",
    description: "",
    size: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/companies`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
        setFilteredCompanies(data);
      } else {
        setErrorMessage("Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setErrorMessage("Error loading companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    const filtered = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  const handleOpenModal = (mode: "create" | "edit", company?: Company) => {
    setModalMode(mode);
    if (mode === "edit" && company) {
      setSelectedCompany(company);
      setFormData({
        name: company.name,
        email: company.email,
        password: "",
        industry: company.industry || "",
        location: company.location || "",
        website: company.website || "",
        description: company.description || "",
        size: company.size || "",
        status: company.status,
      });
    } else {
      setSelectedCompany(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        industry: "",
        location: "",
        website: "",
        description: "",
        size: "",
        status: "Active",
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      industry: "",
      location: "",
      website: "",
      description: "",
      size: "",
      status: "Active",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (modalMode === "create" && !formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const url =
        modalMode === "create"
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/companies`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/companies/${selectedCompany?._id}`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          modalMode === "create"
            ? "Company registered successfully!"
            : "Company updated successfully!"
        );
        setTimeout(() => setSuccessMessage(""), 3000);
        handleCloseModal();
        fetchCompanies();
      } else {
        setErrorMessage(data.message || "Operation failed");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/companies/${companyId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        setSuccessMessage("Company deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchCompanies();
      } else {
        setErrorMessage("Failed to delete company");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      setErrorMessage("An error occurred");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleViewDetails = async (company: Company) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    
    try {
      interface HRData {
        _id: string;
        name: string;
        email: string;
        mobile?: number;
        companyId?: string;
      }

      interface JobData {
        _id: string;
        id?: string;
        title: string;
        applicants: number;
        postedBy?: { _id: string } | string;
      }

      interface ApplicationData {
        _id: string;
        userId: { name: string; email: string };
        jobId: { _id?: string; title: string };
        status: string;
        createdAt: string;
      }

      // Fetch HRs for this company
      const hrsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/hrs`,
        {
          headers: getAuthHeaders(),
        }
      );
      
      let hrs: HRData[] = [];
      if (hrsResponse.ok) {
        const hrsData = await hrsResponse.json();
        console.log("📋 All HRs fetched:", hrsData.hrs.length);
        console.log("🏢 Looking for company ID:", company._id);
        
        // Filter HRs that belong to this company
        hrs = hrsData.hrs.filter((hr: HRData) => {
          // Only consider HRs that have a companyId set
          if (!hr.companyId) {
            console.log(`⚠️ HR ${hr.name} has no companyId - skipping`);
            return false;
          }
          
          const hrCompanyId = hr.companyId.toString();
          const targetCompanyId = company._id.toString();
          const targetCompanyId2 = company.id?.toString();
          
          console.log(`🔍 Checking HR ${hr.name}: companyId="${hrCompanyId}", target="${targetCompanyId}"`);
          
          const matches = hrCompanyId === targetCompanyId || 
                         (targetCompanyId2 && hrCompanyId === targetCompanyId2);
          
          if (matches) {
            console.log(`✅ HR ${hr.name} belongs to this company`);
          }
          
          return matches;
        });
        
        console.log(`✅ Filtered: ${hrs.length} HRs belong to this company out of ${hrsData.hrs.length} total`);
        console.log("✅ Filtered HR names:", hrs.map(h => h.name));
      }

      // Get HR IDs
      const hrIds = hrs.map((hr: HRData) => hr._id);
      console.log("👥 HR IDs for this company:", hrIds);

      // Fetch all jobs using the general jobs endpoint (accessible to admin)
      const jobsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
        {
          headers: getAuthHeaders(),
        }
      );

      let jobs: JobData[] = [];
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        console.log("📋 All jobs fetched:", jobsData.length);
        
        // Filter jobs posted by this company's HRs
        jobs = jobsData.filter((job: JobData) => {
          const posterId = typeof job.postedBy === 'object' ? job.postedBy?._id : job.postedBy;
          const matches = hrIds.some((hrId: string) => hrId.toString() === posterId?.toString());
          if (matches) {
            console.log(`✅ Job "${job.title}" posted by company's HR`);
          }
          return matches;
        });
        
        console.log(`✅ Filtered ${jobs.length} jobs for this company`);
      }

      // Fetch all applications for these jobs
      const jobIds = jobs.map((job: JobData) => job._id || job.id);
      console.log("📋 Job IDs to fetch applications for:", jobIds);
      
      // Fetch applications using the jobs endpoint
      const applications: ApplicationData[] = [];
      for (const jobId of jobIds) {
        try {
          console.log(`📨 Fetching applications for job ${jobId}`);
          const appResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/applications`,
            {
              headers: getAuthHeaders(),
            }
          );
          
          if (appResponse.ok) {
            const appData = await appResponse.json();
            console.log(`✅ Found ${appData.length} applications for job ${jobId}`);
            applications.push(...appData);
          } else {
            console.error(`❌ Failed to fetch applications for job ${jobId}:`, appResponse.status);
          }
        } catch (error) {
          console.error(`❌ Error fetching applications for job ${jobId}:`, error);
        }
      }
      
      console.log(`✅ Total applications fetched: ${applications.length}`);

      setCompanyDetails({
        company,
        hrs,
        jobs,
        applications,
      });
    } catch (error) {
      console.error("Error fetching company details:", error);
      setErrorMessage("Failed to load company details");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-sm border-b sticky top-0 z-10`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className={`p-2 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Company Management
                </h1>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Register and manage companies in the portal
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenModal("create")}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Register Company</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name, email, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Total Companies
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {companies.length}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Active Companies
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {companies.filter((c) => c.status === "Active").length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Pending Approval
                </p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {companies.filter((c) => c.status === "Pending").length}
                </p>
              </div>
              <div className="p-3 bg-amber-500 rounded-full">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Companies List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl border p-16 text-center`}>
            <Building2 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {companies.length === 0 ? "No Companies Registered" : "No Results Found"}
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
              {companies.length === 0
                ? "Start by registering your first company"
                : "Try adjusting your search terms"}
            </p>
            {companies.length === 0 && (
              <button
                onClick={() => handleOpenModal("create")}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Register First Company
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className={`${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } rounded-xl border p-6 shadow-sm hover:shadow-lg transition-all group`}
              >
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {company.name}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          company.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : company.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {company.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {company.email}
                    </p>
                  </div>
                  {company.industry && (
                    <div className="flex items-center gap-2">
                      <Briefcase className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {company.industry}
                      </p>
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {company.location}
                      </p>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {company.size} employees
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleViewDetails(company)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-emerald-50 hover:bg-emerald-100"} ${isDarkMode ? "text-emerald-400" : "text-emerald-600"} rounded-lg font-medium transition-colors`}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleOpenModal("edit", company)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-50 hover:bg-blue-100"} ${isDarkMode ? "text-blue-400" : "text-blue-600"} rounded-lg font-medium transition-colors`}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${isDarkMode ? "bg-gray-700 hover:bg-red-900" : "bg-red-50 hover:bg-red-100"} ${isDarkMode ? "text-red-400" : "text-red-600"} rounded-lg font-medium transition-colors`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Footer Info */}
                <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} mt-4 pt-3 border-t border-gray-200 dark:border-gray-700`}>
                  Registered {new Date(company.createdAt).toLocaleDateString()}
                  {company.registeredBy && ` by ${company.registeredBy.name}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {modalMode === "create" ? "Register New Company" : "Edit Company"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Name */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border ${
                    errors.name ? "border-red-500" : isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="e.g., TechCorp Inc."
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? "border-red-500" : isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="company@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Password {modalMode === "create" && <span className="text-red-500">*</span>}
                  {modalMode === "edit" && <span className="text-xs text-gray-500">(leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.password ? "border-red-500" : isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Industry */}
                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>

                {/* Company Size */}
                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Company Size
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="e.g., New York, USA"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Brief description about the company..."
                />
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {modalMode === "create" ? "Register Company" : "Update Company"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className={`px-6 py-3 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} ${isDarkMode ? "text-white" : "text-gray-700"} rounded-lg font-semibold transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {companyDetails.company?.name} - Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    HRs, Jobs, and Applications Overview
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {detailsLoading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">HR Staff</p>
                        <p className="text-2xl font-bold text-gray-900">{companyDetails.hrs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Jobs Posted</p>
                        <p className="text-2xl font-bold text-gray-900">{companyDetails.jobs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{companyDetails.applications.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HR Staff List */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    HR Staff Members
                  </h3>
                  {companyDetails.hrs.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No HR staff registered for this company yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {companyDetails.hrs.map((hr) => (
                        <div key={hr._id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{hr.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{hr.name}</p>
                              <p className="text-sm text-gray-600">{hr.email}</p>
                              {hr.mobile && <p className="text-xs text-gray-500">{hr.mobile}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Jobs List */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Posted Jobs
                  </h3>
                  {companyDetails.jobs.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No jobs posted yet</p>
                  ) : (
                    <div className="space-y-2">
                      {companyDetails.jobs.map((job) => (
                        <div key={job._id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-600">{job.applicants} applicants</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Applications List */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Received Applications
                  </h3>
                  {companyDetails.applications.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No applications received yet</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {companyDetails.applications.map((app) => (
                        <div key={app._id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{app.userId.name}</p>
                              <p className="text-sm text-gray-600">{app.userId.email}</p>
                              <p className="text-xs text-gray-500 mt-1">Applied for: {app.jobId.title}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                app.status === "Accepted"
                                  ? "bg-green-100 text-green-700"
                                  : app.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : app.status === "Interview"
                                  ? "bg-purple-100 text-purple-700"
                                  : app.status === "Under Review"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {app.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

