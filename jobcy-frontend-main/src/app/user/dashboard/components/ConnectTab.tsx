"use client";

import React, { useState } from "react";
import { Search, Users } from "lucide-react";
import ConnectionCard from "./ConnectionCard";

// ✅ Import the same Connection type we defined for ConnectionCard
// (You can also move this interface to a shared `types.ts` file)
interface Connection {
  id: string | number;
  name: string;
  title?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  status?: "seeking" | "open" | "employed";
  connected?: boolean;
}

// ✅ Props type for ConnectTab
interface ConnectTabProps {
  connections: Connection[];
  isDark?: boolean;
}

export default function ConnectTab({ connections, isDark = false }: ConnectTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredConnections = connections.filter((conn) => {
    const nameMatch = conn.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = conn.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || titleMatch;
  });

  const handleConnect = async (connection: Connection) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to send connection requests");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: connection.id,
          message: `Hi ${connection.name}, I'd like to connect with you.`,
        }),
      });

      if (response.ok) {
        alert(`Connection request sent to ${connection.name}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request. Please try again.");
    }
  };

  const handleMessage = (connection: Connection) => {
    alert(`Opening message with ${connection.name}`);
    // In production: Navigate to messaging interface
  };

  console.log("ConnectTab - connections:", connections);
  console.log("ConnectTab - filteredConnections:", filteredConnections);

  return (
    <div>
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-slate-900"
          } mb-2`}
        >
          Connect with Professionals
        </h2>
        <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Expand your network
          {/* ({connections.length} users available) */}
        </p>
      </div>

      <div
        className={`${isDark ? "bg-slate-800" : "bg-white"} rounded-lg border ${
          isDark ? "border-slate-700" : "border-slate-200"
        } p-4 mb-6`}
      >
        <div className="flex items-center space-x-3">
          <Search
            className={`w-5 h-5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search by name, title, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent border-none focus:outline-none ${
              isDark
                ? "text-white placeholder:text-slate-500"
                : "text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
      </div>

      {filteredConnections.length === 0 ? (
        <div
          className={`${
            isDark ? "bg-slate-800" : "bg-white"
          } rounded-lg border ${
            isDark ? "border-slate-700" : "border-slate-200"
          } p-12 text-center`}
        >
          <Users
            className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-slate-600" : "text-slate-300"
            }`}
          />
          <h3
            className={`text-lg font-semibold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {connections.length === 0
              ? "No Users Available"
              : "No Results Found"}
          </h3>
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {connections.length === 0
              ? "There are no other users registered yet. Check back later!"
              : "Try adjusting your search terms"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConnections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              isDark={isDark}
              onConnect={handleConnect}
              onMessage={handleMessage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
