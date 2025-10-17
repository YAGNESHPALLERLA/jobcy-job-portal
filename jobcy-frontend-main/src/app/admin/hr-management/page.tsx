"use client";

import React, { useState, useEffect ,ChangeEvent} from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Calendar,
  Filter,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
// HR user interface
interface Company {
  name: string;
  location?: string;
  description?: string;
  website?: string;
}

interface HRUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  company?: Company;
  companySize?: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  status?: "Active" | "Inactive";
  createdDate?: string;
}

// Form state interface
interface HRFormData {
  name: string;
  email: string;
  password: string;
  company: string;
  companyId?: string;           // Add companyId to link HR to company
  companyLocation?: string;      
  companyDescription?: string;   
  companySize: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
}

// Company interface for dropdown
interface CompanyOption {
  _id: string;
  name: string;
  email: string;
}


// Error type
interface HRErrors {
  name?: string;
  email?: string;
  password?: string;
  company?: string;
  industry?: string;
  general?: string;
}

export default function HRManagement() {
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [hrUsers, setHrUsers] = useState<HRUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHR, setSelectedHR] = useState<HRUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<HRErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);

  const [formData, setFormData] = useState<HRFormData>({
    name: "",
    email: "",
    password: "",
    company: "",
    companyId: "",
    companySize: "",
    industry: "",
    website: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/hrs", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`);
        }

        const data = await res.json();
        setHrUsers(Array.isArray(data.hrs) ? data.hrs : []);
      } catch (err) {
        console.error("Failed to fetch HR users", err);
        setHrUsers([]); // fallback empty
      }
    };

    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/companies", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCompanies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch companies", err);
        setCompanies([]);
      }
    };

    fetchHRs();
    fetchCompanies();
  }, []);

const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof HRErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors : HRErrors= {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";

    if (currentView === "create" && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");
    setErrors({});

    // Transform company string into object with name
    const payload = {
      ...formData,
      company: {
        name: formData.company,
        location: formData.companyLocation || "", // Add if available
        description: formData.companyDescription || "", // Add if available
        website: formData.website || "",
      },
      companyId: formData.companyId || undefined, // Include companyId to link HR to Company
    };

    try {
      if (currentView === "create") {
        const res = await fetch("http://localhost:5000/api/admin/create-hr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create HR");
        }

        const data = await res.json();
        setHrUsers((prev) => [...prev, data.hr]); // update list with new HR
        setSuccessMessage("HR user created successfully!");
      } else if (currentView === "edit") {
  if (!selectedHR) {
    setErrors({ general: "No HR user selected for editing." });
    setIsLoading(false);
    return;
  }

  const res = await fetch(
    `http://localhost:5000/api/admin/hrs/${selectedHR._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    }
  );


        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update HR");
        }

        const data = await res.json();
        setHrUsers((prev) =>
          prev.map((hr) => (hr._id === selectedHR._id ? data.hr : hr))
        );
        setSuccessMessage("HR user updated successfully!");
      }

      // Reset form and view after success
      setTimeout(() => {
        setCurrentView("list");
        resetForm();
        setSuccessMessage("");
      }, 1500);
    } catch (error: unknown) {
      let message = "An error occurred. Please try again.";
      if (error instanceof Error) {
        message = error.message;
  }

  setErrors({ general: message });
}
 finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (hr:HRUser) => {
    setSelectedHR(hr);
    setFormData({
      name: hr.name,
      email: hr.email,
      password: "",
      company: hr.company?.name || "",
      companySize: hr.companySize || "",
      industry: hr.industry || "",
      website: hr.company?.website || "",
      phone: hr.phone || "",
      address: hr.address || "",
    });
    setCurrentView("edit");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this HR user?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/hrs/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete HR");
        }

        setHrUsers((prev) => prev.filter((hr) => hr._id !== id));
        setSuccessMessage("HR user deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error: unknown) {
        let message = "An error occurred. Please try again.";
        if (error instanceof Error) {
          message = error.message;
        }

        setErrors({ general: message });
     }

    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      company: "",
      companySize: "",
      industry: "",
      website: "",
      phone: "",
      address: "",
    });
    setErrors({});
    setSelectedHR(null);
  };

  const filteredHRs = hrUsers.filter((hr) =>
    hr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hr.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );


  const renderListView = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            HR User Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage HR users and their company details
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setCurrentView("create");
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New HR</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search HR users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 ml-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* HR Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">
                  Company
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">
                  Created Date
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHRs.map((hr) => (
                <tr key={hr._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {hr.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{hr.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{hr.company?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{hr.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {hr.createdDate ? new Date(hr.createdDate).toLocaleDateString() : "N/A"}
                        </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hr.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {hr.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(hr)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit HR"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hr._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete HR"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHRs.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No HR users found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderForm = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setCurrentView("list");
              resetForm();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentView === "create" ? "Create New HR User" : "Edit HR User"}
            </h2>
            <p className="text-gray-600 mt-1">
              {currentView === "create"
                ? "Add a new HR user and company details"
                : "Update HR user information and company details"}
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-gray-900 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-gray-900 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password {currentView === "create" && "*"}
                {currentView === "edit" && (
                  <span className="text-sm font-normal text-gray-500">
                    (Leave blank to keep current)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-colors text-gray-900 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                  placeholder={
                    currentView === "create"
                      ? "Enter password"
                      : "Enter new password (optional)"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Registered Company (Optional)
              </label>
              <select
                name="companyId"
                value={formData.companyId || ""}
                onChange={(e) => {
                  const selectedCompany = companies.find(c => c._id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    companyId: e.target.value,
                    company: selectedCompany ? selectedCompany.name : prev.company,
                  }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
              >
                <option value="">-- Select a company (or enter manually below) --</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name} ({company.email})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select an existing company from the dropdown, or enter company details manually below
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-gray-900 ${
                  errors.company
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder="Enter company name"
              />
              {errors.company && (
                <p className="mt-2 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-gray-900 ${
                  errors.industry
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
              {errors.industry && (
                <p className="mt-2 text-sm text-red-600">{errors.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Size
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="10-50">10-50 employees</option>
                <option value="50-100">50-100 employees</option>
                <option value="100-500">100-500 employees</option>
                <option value="500-1000">500-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                placeholder="https://company.com"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
            placeholder="Enter company address"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              setCurrentView("list");
              resetForm();
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>
                  {currentView === "create"
                    ? "Create HR User"
                    : "Update HR User"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentView === "list" ? renderListView() : renderForm()}
      </div>
    </div>
  );
}
