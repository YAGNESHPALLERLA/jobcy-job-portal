"use client";

import React, { useState, useEffect } from "react";
import { Bell, Clock, XCircle, Briefcase, Eye } from "lucide-react";

interface Notification {
  _id: string;
  type: "application_status" | "interview_scheduled" | "job_update";
  title: string;
  message: string;
  relatedJob?: {
    _id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface NotificationsTabProps {
  isDark: boolean;
}

export default function NotificationsTab({ isDark }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Error loading notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application_status":
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case "interview_scheduled":
        return <Clock className="w-5 h-5 text-green-500" />;
      case "job_update":
        return <Bell className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>{error}</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Notifications
          </h2>
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Stay updated with your application status
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Bell className="w-4 h-4" />
            <span>{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              No notifications yet
            </h3>
            <p className={`${isDark ? "text-slate-500" : "text-slate-400"}`}>
              You will receive notifications when HR updates your applications
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`relative p-6 rounded-xl border transition-all ${
                notification.isRead
                  ? `${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`
                  : `${isDark ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"}`
              } ${!notification.isRead ? "ring-2 ring-blue-500/20" : ""}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {notification.message}
                      </p>
                      {notification.relatedJob && (
                        <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Related to: <span className="font-medium">{notification.relatedJob.title}</span>
                        </p>
                      )}
                      <p className={`mt-2 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className={`ml-4 p-2 rounded-lg transition-colors ${
                          isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                        }`}
                        title="Mark as read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!notification.isRead && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}