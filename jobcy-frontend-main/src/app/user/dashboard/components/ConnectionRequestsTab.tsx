"use client";

import React, { useState, useEffect } from "react";
import { Check, X, User } from "lucide-react";

interface ConnectionRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    professionalRole?: string;
    currentLocation?: string;
  };
  message?: string;
  createdAt: string;
}

interface ConnectionRequestsTabProps {
  isDark?: boolean;
}

export default function ConnectionRequestsTab({ isDark = false }: ConnectionRequestsTabProps) {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnectionRequests();
  }, []);

  const fetchConnectionRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setError("Failed to fetch connection requests");
      }
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      setError("Failed to fetch connection requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/${requestId}/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the request from the list
        setRequests(requests.filter(req => req._id !== requestId));
        alert("Connection request accepted!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to accept connection request");
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
      alert("Failed to accept connection request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/${requestId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the request from the list
        setRequests(requests.filter(req => req._id !== requestId));
        alert("Connection request rejected");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to reject connection request");
      }
    } catch (error) {
      console.error("Error rejecting connection request:", error);
      alert("Failed to reject connection request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"} mb-2`}>
          Connection Requests
        </h2>
        <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Manage incoming connection requests ({requests.length})
        </p>
      </div>

      {requests.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <User className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            No Connection Requests
          </h3>
          <p>You don&apos;t have any pending connection requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className={`${
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              } rounded-xl border p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {request.sender.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                      {request.sender.name}
                    </h3>
                    <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"} mb-2`}>
                      {request.sender.professionalRole || "Professional"}
                      {request.sender.currentLocation && ` • ${request.sender.currentLocation}`}
                    </p>

                    {request.message && (
                      <div className={`p-3 rounded-lg mb-3 ${
                        isDark ? "bg-slate-700" : "bg-slate-50"
                      }`}>
                        <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          &ldquo;{request.message}&rdquo;
                        </p>
                      </div>
                    )}

                    <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}