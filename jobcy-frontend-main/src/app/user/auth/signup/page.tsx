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
  Briefcase,
  Users,
  TrendingUp,
} from "lucide-react";

interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [careerLevel, setCareerLevel] = useState<"fresher" | "experienced" | "">("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Reset form on mount
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setCurrentStep(1);
    setCareerLevel("");
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      if (digitsOnly.length >= 6) {
        processedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      } else if (digitsOnly.length >= 3) {
        processedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else {
        processedValue = digitsOnly;
      }
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleCareerSubmit = async () => {
    if (!careerLevel) {
      setErrors({ general: "Please select your career level" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          mobile: formData.phone.replace(/\D/g, ""),
          password: formData.password,
          role: "user",
          careerStatus: careerLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Registration failed" });
        return;
      }

      // Auto login
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
        setIsSuccess(true);
      } else {
        window.location.href = "/user/auth/login";
      }
    } catch {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, text: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

    return {
      level: score,
      text: levels[Math.min(score - 1, 4)] || "",
      color: colors[Math.min(score - 1, 4)] || "bg-gray-300",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Welcome to OHG 365</h1>
            <p className="text-xl mb-8">Jobcy Portal</p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Briefcase className="w-6 h-6" />
                <span className="text-lg">Find Your Dream Job</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Users className="w-6 h-6" />
                <span className="text-lg">Connect with Professionals</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <TrendingUp className="w-6 h-6" />
                <span className="text-lg">Advance Your Career</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Registration Successful!
              </h1>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  Your account has been created. You can now explore job opportunities.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Confirmation sent to {formData.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>Verification sent to {formData.phone}</span>
                </div>
                <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    const dashboardPath = user.role === "admin" ? "/admin/dashboard" : user.role === "hr" ? "/hr/dashboard" : "/user/dashboard";
                    window.location.href = dashboardPath;
                  }}
                  className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500">Redirecting in 3 seconds...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Select Career Level
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Tell us about your professional experience.
          </p>
          <div className="space-y-4 mb-6">
            <button
              className={`w-full py-3 rounded-lg border-2 transition-colors ${
                careerLevel === "fresher"
                  ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:border-blue-400"
              }`}
              onClick={() => setCareerLevel("fresher")}
              disabled={isSubmitting}
            >
              I am a Fresher (No experience)
            </button>
            <button
              className={`w-full py-3 rounded-lg border-2 transition-colors ${
                careerLevel === "experienced"
                  ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:border-blue-400"
              }`}
              onClick={() => setCareerLevel("experienced")}
              disabled={isSubmitting}
            >
              I am Experienced (Have work experience)
            </button>
          </div>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-600 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.general}</span>
            </div>
          )}
          <button
            onClick={handleCareerSubmit}
            disabled={isSubmitting || !careerLevel}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? "Creating Account..." : "Complete Registration"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-lg mb-4">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your professional journey today
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-8">
          <form onSubmit={handleStep1Submit} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-800 text-sm font-medium">Error</p>
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="john.doe@example.com"
                  disabled={isSubmitting}
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="XXX-XXX-XXXX"
                  disabled={isSubmitting}
                  maxLength={12}
                />
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="Create a strong password"
                  disabled={isSubmitting}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 min-w-16 text-right">
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-start space-x-1">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-1.5">
                  {formData.password === formData.confirmPassword ? (
                    <p className="text-sm text-green-600 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Passwords match</span>
                    </p>
                  ) : (
                    !errors.confirmPassword && (
                      <p className="text-sm text-orange-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Passwords do not match</span>
                      </p>
                    )
                  )}
                </div>
              )}
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/user/auth/login"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Already have an account? Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
