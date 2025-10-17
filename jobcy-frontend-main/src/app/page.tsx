"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  LogIn,
  UserPlus,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      content: "Jobcy helped me find my dream job in just 2 weeks. The platform is intuitive and the matching algorithm is spot on!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "HR Manager",
      company: "TechCorp",
      content: "As an HR professional, Jobcy has streamlined our hiring process. We've found amazing talent quickly and efficiently.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The quality of candidates on Jobcy is exceptional. We've built an incredible team thanks to this platform.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSignIn = () => {
    router.push("/user/auth/login");
  };

  const handleSignUp = () => {
    router.push("/user/auth/signup");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"}`}>
      {/* Header */}
      <header className={`${isDark ? "bg-slate-800/95 backdrop-blur-sm border-slate-700" : "bg-white/95 backdrop-blur-sm border-slate-200"} border-b sticky top-0 z-50 shadow-lg`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl animate-pulse">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Jobcy</h1>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Your Career Journey Starts Here</p>
              </div>
            </div>

            {/* Theme Toggle & Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDark ? "bg-slate-700 text-yellow-400 hover:bg-slate-600 hover:scale-105" : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                } shadow-md`}
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              <button
                onClick={handleSignIn}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105" : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
                } shadow-md`}
              >
                Sign In
              </button>

              <button
                onClick={handleSignUp}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className={`text-sm font-medium ${isDark ? "text-blue-300" : "text-blue-700"}`}>Trusted by 50,000+ Professionals</span>
              </div>

              <h1 className={`text-6xl md:text-7xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"} leading-tight`}>
                Find Your
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Dream Job</span>
                <br />Today
              </h1>

              <p className={`text-xl md:text-2xl mb-10 ${isDark ? "text-slate-400" : "text-slate-600"} max-w-3xl mx-auto leading-relaxed`}>
                Connect with top companies, discover opportunities that match your skills, and accelerate your career growth with our intelligent job matching platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <button
                  onClick={handleSignIn}
                  className="group flex items-center justify-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
                >
                  <LogIn className="w-6 h-6" />
                  <span>Sign In to Explore</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleSignUp}
                  className={`group flex items-center justify-center space-x-3 px-10 py-5 border-2 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                    isDark
                      ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <UserPlus className="w-6 h-6" />
                  <span>Join Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-transform duration-300`}>
                <Briefcase className={`w-10 h-10 mx-auto mb-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <div className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>10,000+</div>
                <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>Active Jobs</div>
              </div>

              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-transform duration-300`}>
                <Building2 className={`w-10 h-10 mx-auto mb-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                <div className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>500+</div>
                <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>Companies</div>
              </div>

              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-transform duration-300`}>
                <Users className={`w-10 h-10 mx-auto mb-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <div className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>50,000+</div>
                <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>Job Seekers</div>
              </div>

              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-transform duration-300`}>
                <TrendingUp className={`w-10 h-10 mx-auto mb-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                <div className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>95%</div>
                <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>Success Rate</div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-all duration-300`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? "bg-blue-900/50" : "bg-blue-100"} shadow-lg`}>
                  <Briefcase className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>For Job Seekers</h3>
                <p className={`text-base leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Browse thousands of job opportunities, apply with ease, and track your applications all in one place. Our AI-powered matching helps you find the perfect role.
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-all duration-300`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? "bg-purple-900/50" : "bg-purple-100"} shadow-lg`}>
                  <Building2 className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>For HR Professionals</h3>
                <p className={`text-base leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Post jobs, manage applications, schedule interviews, and find the perfect candidates for your team. Streamline your entire hiring process.
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className={`text-center p-8 rounded-2xl ${isDark ? "bg-slate-800/50" : "bg-white/70"} backdrop-blur-sm shadow-xl border ${isDark ? "border-slate-700" : "border-slate-200"} hover:scale-105 transition-all duration-300`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? "bg-orange-900/50" : "bg-orange-100"} shadow-lg`}>
                  <Users className={`w-8 h-8 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>For Administrators</h3>
                <p className={`text-base leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Oversee platform operations, manage users, and ensure a smooth experience for all stakeholders. Comprehensive admin tools at your fingertips.
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className={`text-center p-12 rounded-3xl ${isDark ? "bg-slate-800/30" : "bg-white/50"} backdrop-blur-sm shadow-2xl border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-slate-900"}`}>
                What Our Users Say
              </h2>

              <div className="max-w-4xl mx-auto">
                <div className={`p-8 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white"} shadow-lg`}>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className={`text-lg italic mb-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    &quot;{testimonials[currentTestimonial].content}&quot;
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"} flex items-center justify-center font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-blue-600 scale-125"
                          : isDark ? "bg-slate-600" : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${isDark ? "bg-slate-800/95 backdrop-blur-sm border-slate-700" : "bg-white/95 backdrop-blur-sm border-slate-200"} border-t mt-20`}>
        <div className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Jobcy</span>
                </div>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                  Connecting talent with opportunity. Your career journey starts here.
                </p>
              </div>

              <div>
                <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>For Job Seekers</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Browse Jobs</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Career Advice</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Resume Builder</a></li>
                </ul>
              </div>

              <div>
                <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>For Employers</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Post a Job</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Find Candidates</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Recruiting Solutions</a></li>
                </ul>
              </div>

              <div>
                <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Support</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            {/* Portal Links */}
            <div className={`mt-8 p-6 ${isDark ? "bg-slate-700/50" : "bg-gradient-to-r from-blue-50 to-purple-50"} rounded-xl`}>
              <h4 className={`font-semibold mb-4 text-center ${isDark ? "text-white" : "text-slate-900"}`}>Access Portals</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => router.push("/user/auth/login")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? "bg-slate-600 text-slate-200 hover:bg-slate-500" : "bg-white text-slate-700 hover:bg-slate-50"} shadow-sm hover:shadow-md`}
                >
                  Job Seeker Portal
                </button>
                <button
                  onClick={() => router.push("/hr/auth/login")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? "bg-slate-600 text-slate-200 hover:bg-slate-500" : "bg-white text-slate-700 hover:bg-slate-50"} shadow-sm hover:shadow-md`}
                >
                  HR Portal
                </button>
                <button
                  onClick={() => router.push("/company/auth/login")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? "bg-slate-600 text-slate-200 hover:bg-slate-500" : "bg-white text-slate-700 hover:bg-slate-50"} shadow-sm hover:shadow-md`}
                >
                  Company Portal
                </button>
                <button
                  onClick={() => router.push("/admin/auth/login")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? "bg-slate-600 text-slate-200 hover:bg-slate-500" : "bg-white text-slate-700 hover:bg-slate-50"} shadow-sm hover:shadow-md`}
                >
                  Admin Portal
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-center">
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                © 2024 Jobcy. All rights reserved. Connecting talent with opportunity worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
