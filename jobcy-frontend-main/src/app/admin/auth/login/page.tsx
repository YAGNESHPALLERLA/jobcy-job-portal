"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  Briefcase,
  Users,
  TrendingUp,
  Building2,
} from "lucide-react";
type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    const newErrors:Errors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (name in errors) setErrors((prev) => ({ ...prev, [name]: "" }));
  if (loginError) setLoginError("");
};


  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setLoginError("");

    try {
      console.log("Login URL:", `${process.env.NEXT_PUBLIC_API_URL}/login`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (!response.ok) {
        setLoginError(data.message || "Invalid credentials");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("User role:", data.user.role); // Debug log

        // Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (data.user.role === "hr") {
          window.location.href = "/hr/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Unable to connect to server. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-600 dark:bg-orange-500 rounded-lg mb-4 shadow-sm">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to continue to your dashboard
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="space-y-5">
            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                    Sign In Failed
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {loginError}
                  </p>
                </div>
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
                      : "border-slate-300 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/50"
                  }`}
                  placeholder="admin@example.com"
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
                      : "border-slate-300 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/50"
                  }`}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 dark:bg-orange-500 dark:hover:bg-orange-600 dark:disabled:bg-orange-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900/50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start space-x-2">
                <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Admin Panel
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage platform
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Full Control
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    System oversight
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    User Management
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Handle accounts
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Analytics
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Platform insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              New admin?{" "}
              <a
                href="/user/auth/signup?mode=admin-signup"
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors"
              >
                Create Admin Account
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2024 Job Portal Admin Panel.
          </p>
        </div>
      </div>
    </div>
  );
}