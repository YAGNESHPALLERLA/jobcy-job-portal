import React from "react";
import { UserPlus, LogIn, Briefcase, Building2, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Jobcy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your gateway to exciting career opportunities. Connect with top companies,
            find your dream job, and advance your professional journey.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                New to Jobcy?
              </h2>
              <p className="text-gray-600 mb-6">
                Create your account and start exploring job opportunities tailored to your skills.
              </p>
              <a
                href="/user/auth/signup"
                className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </a>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Already have an account?
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to access your dashboard, view applications, and manage your profile.
              </p>
              <a
                href="/user/auth/login"
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Admin and HR Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <Building2 className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  For Administrators
                </h2>
                <p className="text-gray-600 mb-6">
                  Oversee the platform, manage users, and ensure smooth operations.
                </p>
                <a
                  href="/admin/auth/login"
                  className="inline-flex items-center justify-center w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Admin Sign In
                </a>
              </div>
            </div>

            {/* HR Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  For HR Personnel
                </h2>
                <p className="text-gray-600 mb-6">
                  Manage jobs, review applications, and oversee recruitment processes.
                </p>
                <a
                  href="/hr/auth/login"
                  className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  HR Sign In
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose Jobcy?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Smart Matching</h4>
              <p className="text-gray-600 text-sm">
                AI-powered job recommendations based on your profile and preferences.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Easy Application</h4>
              <p className="text-gray-600 text-sm">
                Apply to jobs with one click and track your application status.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Career Growth</h4>
              <p className="text-gray-600 text-sm">
                Access resources and tools to advance your career journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
