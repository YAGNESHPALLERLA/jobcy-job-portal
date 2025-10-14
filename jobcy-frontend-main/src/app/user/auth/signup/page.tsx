"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  Phone,
} from "lucide-react";
type FormData = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<Record<keyof FormData, string>> & { general?: string };

type Mode = 'user-signup' | 'admin-signup' | 'hr-signup';

export default function UserSignup() {
  const [mode, setMode] = useState<Mode>('user-signup');
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [registrationStep, setRegistrationStep] = useState(1);
  const [careerStatus, setCareerStatus] = useState(""); // "fresher" or "experienced"

  const getTitle = () => {
    switch (mode) {
      case 'user-signup': return 'Create Your Account';
      case 'admin-signup': return 'Create Admin Account';
      case 'hr-signup': return 'Create HR Account';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'user-signup': return 'Start your professional journey today';
      case 'admin-signup': return 'Create an admin account for the platform';
      case 'hr-signup': return 'Create an HR account for your company';
    }
  };

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
    setCompany("");
    setErrors({});
    setGeneralError("");
    setRegistrationStep(1);
    setCareerStatus("");
  }, [mode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode') as Mode;
      if (modeParam && ['user-signup', 'admin-signup', 'hr-signup'].includes(modeParam)) {
        setMode(modeParam);
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: Errors = {};

    if (mode !== 'admin-signup') {
      if (!formData.name.trim()) {
        newErrors.name = "Full name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters long";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (mode === 'user-signup') {
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (mode !== 'admin-signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (mode === 'hr-signup' && !company.trim()) {
      newErrors.general = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "company") {
    setCompany(value);
    if (generalError) setGeneralError("");
    return;
  }

  let formattedValue = value;
  if (name === "mobile") {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length > 6) {
      formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      formattedValue = digits;
    }
  }

  setFormData((prev) => ({ ...prev, [name]: formattedValue }));

  if (name in errors) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  if (generalError) setGeneralError("");
};



  const handleRegistrationSubmit = async (role: string, company?: string) => {
    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: role === 'user' ? formData.mobile.replace(/\D/g, "") : undefined,
          password: formData.password,
          role,
          company,
          careerStatus: role === 'user' ? careerStatus : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.error || "Registration failed");
      } else {
        // Auto-login
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify(loginData.user));
          setRegistrationSuccess(true);
        } else {
          window.location.href = "/user/auth/login";
        }
      }
    } catch {
      setGeneralError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (mode === 'user-signup') {
      setRegistrationStep(2);
    } else {
      const role = mode === 'admin-signup' ? 'admin' : mode === 'hr-signup' ? 'hr' : 'user';
      handleRegistrationSubmit(role, mode === 'hr-signup' ? company : undefined);
    }
  };

  const handleCareerStatusSubmit = async () => {
    if (!careerStatus) return; // Show error if not selected
    await handleRegistrationSubmit('user');
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/(?=.*[a-z])/.test(password)) strength += 1;
    if (/(?=.*[A-Z])/.test(password)) strength += 1;
    if (/(?=.*\d)/.test(password)) strength += 1;
    if (/(?=.*[@$!%*?&])/.test(password)) strength += 1;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[Math.min(strength - 1, 4)] || "",
      color: colors[Math.min(strength - 1, 4)] || "bg-slate-200",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 dark:bg-green-600 rounded-full mb-6 shadow-md">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Registration Successful!
            </h1>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-800 dark:text-green-300 text-sm">
                Your account has been created successfully. You can now sign in
                and start exploring job opportunities.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4" />
                <span>Confirmation email sent to {formData.email}</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4" />
                <span>Verification SMS sent to {formData.mobile}</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    const dashboardUrl = user.role === "admin" ? "/admin/dashboard" : user.role === "hr" ? "/hr/dashboard" : "/user/dashboard";
                    window.location.href = dashboardUrl;
                  }}
                  className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (registrationStep === 2 && mode === 'user-signup' && !registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Select Your Career Status
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Let us know where you are in your professional journey.
          </p>
          <div className="flex flex-col w-full space-y-4 mb-6">
            <button
              className={`w-full py-3 rounded-lg border-2 ${
                careerStatus === "fresher"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 font-semibold"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-400"
              } transition-colors`}
              onClick={() => setCareerStatus("fresher")}
              disabled={isLoading}
            >
              I&apos;m a Fresher (No prior experience)
            </button>
            <button
              className={`w-full py-3 rounded-lg border-2 ${
                careerStatus === "experienced"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 font-semibold"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-400"
              } transition-colors`}
              onClick={() => setCareerStatus("experienced")}
              disabled={isLoading}
            >
              I&apos;m Experienced (Have work experience)
            </button>
          </div>
          {generalError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{generalError}</span>
            </div>
          )}
          <button
            onClick={handleCareerStatusSubmit}
            disabled={isLoading || !careerStatus}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none"
          >
            {isLoading ? "Submitting..." : "Complete Registration"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-lg mb-4 shadow-sm">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {getTitle()}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {getDescription()}
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <button onClick={() => setMode('user-signup')} className={`px-3 py-1 text-sm rounded-lg ${mode === 'user-signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>User Signup</button>
            <button onClick={() => setMode('admin-signup')} className={`px-3 py-1 text-sm rounded-lg ${mode === 'admin-signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Admin Signup</button>
            <button onClick={() => setMode('hr-signup')} className={`px-3 py-1 text-sm rounded-lg ${mode === 'hr-signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>HR Signup</button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="space-y-5">
            {generalError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                    Registration Failed
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {generalError}
                  </p>
                </div>
              </div>
            )}

            {(
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  Full Name
                </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                    errors.name
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                      : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  }`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                <User className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                      : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  }`}
                  placeholder="john.doe@example.com"
                  disabled={isLoading}
                />
                <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {mode === 'user-signup' && (
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  Mobile Number
                </label>
              <div className="relative">
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                    errors.mobile
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                      : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  }`}
                  placeholder="XXX-XXX-XXXX"
                  disabled={isLoading}
                  maxLength={12}
                />
                <Phone className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.mobile && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.mobile}</span>
                </p>
              )}
            </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                      : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  }`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-16 text-right">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-start space-x-1">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {mode !== 'admin-signup' && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  Confirm Password
                </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                      : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  }`}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                />
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="mt-1.5">
                  {formData.password === formData.confirmPassword ? (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Passwords match</span>
                    </p>
                  ) : (
                    !errors.confirmPassword && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Passwords don&apos;t match</span>
                      </p>
                    )
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
            )}

            {mode === 'hr-signup' && (
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  Company Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={company}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                      errors.general
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                        : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                    }`}
                    placeholder="Enter company name"
                    disabled={isLoading}
                  />
                  <User className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.general && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.general}</span>
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/user/auth/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              Already have an account? Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
