"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Users, MessageCircle, Send, X, Sparkles, UserCheck, Clock, CheckCircle, XCircle, Bell } from "lucide-react";
import ConnectionCard from "./ConnectionCard";
import { useChat } from "../hooks/useChat";

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

interface ConnectionRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email?: string;
    professionalRole?: string;
    currentLocation?: string;
  };
  receiver?: {
    _id: string;
    name: string;
  };
  message?: string;
  status: string;
  createdAt: string;
}

interface ActualConnection {
  id: string;
  name: string;
  title?: string;
  location?: string;
  email?: string;
  connected: boolean;
  connectedAt?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    _id?: string;
    name: string;
    email: string;
  };
  isRead: boolean;
  createdAt: string;
}

// ✅ Props type for ConnectTab
interface ConnectTabProps {
  connections: Connection[];
  isDark?: boolean;
}

export default function ConnectTab({ connections, isDark = false }: ConnectTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [connectionsState, setConnectionsState] = useState<Connection[]>(connections);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [actualConnections, setActualConnections] = useState<ActualConnection[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'connections'>('discover');
  
  // Real-time chat functionality
  const {
    isConnected,
    chats,
    currentChat,
    messages,
    isLoading,
    error: chatError,
    fetchChats,
    getOrCreateChat,
    fetchMessages,
    sendMessage,
    joinChat,
    sendTyping,
    stopTyping,
    setCurrentChat
  } = useChat();

  // Sync with prop changes
  React.useEffect(() => {
    console.log("ConnectTab useEffect - connections prop:", connections);
    setConnectionsState(connections);
  }, [connections]);

  // Debug when connectionsState changes
  React.useEffect(() => {
    console.log("ConnectTab - connectionsState changed:", connectionsState);
    console.log("ConnectTab - connected count:", connectionsState.filter(c => c.connected).length);
  }, [connectionsState]);

  // Debug actual connections
  React.useEffect(() => {
    console.log("ConnectTab - actualConnections:", actualConnections);
    console.log("ConnectTab - actualConnections IDs:", actualConnections.map(c => c.id));
  }, [actualConnections]);

  // Fetch connection requests and actual connections
  const fetchConnectionData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch received requests
      const receivedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setPendingRequests(data);
      }

      // Fetch sent requests
      const sentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/sent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (sentRes.ok) {
        const data = await sentRes.json();
        setSentRequests(data);
      }

      // Fetch actual connections
      const connectionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (connectionsRes.ok) {
        const data = await connectionsRes.json();
        setActualConnections(data);
      }
    } catch (error) {
      console.error("Error fetching connection data:", error);
    }
  };

  // Fetch chats when component mounts
  useEffect(() => {
    fetchConnectionData();
    if (isConnected) {
      fetchChats();
    }
  }, [isConnected, fetchChats]);

  // Generate random gradient colors based on name
  const getGradientColors = (name: string) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-teal-500 to-cyan-600",
    ];
    const index = name ? name.length % gradients.length : 0;
    return gradients[index];
  };

  // Helper to check if user is already connected
  const isUserConnected = (userId: string | number) => {
    return actualConnections.some(conn => 
      conn.id?.toString() === userId?.toString()
    );
  };

  // Helper to check if there's a pending request to/from this user
  const hasPendingRequest = (userId: string | number) => {
    return pendingRequests.some(req => 
      req.sender._id?.toString() === userId?.toString()
    ) || sentRequests.some(req => 
      req.receiver?._id?.toString() === userId?.toString()
    );
  };

  const filteredConnections = connectionsState.filter((conn) => {
    // Don't show if already connected
    const connected = isUserConnected(conn.id);
    if (connected) {
      console.log(`✓ Filtering out ${conn.name} (${conn.id}) - already connected`);
      return false;
    }
    
    // Don't show if there's a pending request
    const pending = hasPendingRequest(conn.id);
    if (pending) {
      console.log(`✓ Filtering out ${conn.name} (${conn.id}) - has pending request`);
      return false;
    }
    
    // Search filter
    const nameMatch = conn.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = conn.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || titleMatch;
  });

  // Use actual connections from backend
  const connectedConnections = actualConnections;

  console.log("ConnectTab - connectionsState:", connectionsState);
  console.log("ConnectTab - connectedConnections:", connectedConnections);
  console.log("ConnectTab - filteredConnections count:", filteredConnections.length);
  console.log("ConnectTab - connectionsState.map(conn => ({id: conn.id, name: conn.name, connected: conn.connected})):", 
    connectionsState.map(conn => ({id: conn.id, name: conn.name, connected: conn.connected})));

  const handleConnect = async (connection: Connection) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to send connection requests");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: connection.id,
          message: `Hi ${connection.name}, I would like to connect with you!`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Connection request sent to ${connection.name}!`);
        await fetchConnectionData(); // Refresh connection data
      } else {
        alert(data.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request. Please try again.");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/${requestId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the request from pending immediately for instant UI update
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        
        // Fetch updated connection data
        await fetchConnectionData();
        await fetchChats();
        
        alert("✅ Connection request accepted! You can now message each other.");
        console.log("Connection accepted, data refreshed");
      } else {
        alert("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/${requestId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the request from pending immediately for instant UI update
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        
        // Refresh connection data
        await fetchConnectionData();
        
        alert("Connection request rejected");
        console.log("Connection rejected, data refreshed");
      } else {
        alert("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    }
  };

  const handleMessage = async (connection: Connection | ActualConnection) => {
    // Check if this user is in actual connections
    const isConnected = actualConnections.some(conn => conn.id.toString() === connection.id.toString());
    
    if (isConnected) {
      try {
        // Get or create chat with this user
        const chat = await getOrCreateChat(connection.id.toString());
        if (chat) {
          setSelectedConnection(connection as Connection);
          setCurrentChat(chat);
          joinChat(chat.id);
          await fetchMessages(chat.id);
        }
      } catch (error) {
        console.error("Error opening chat:", error);
        alert("Failed to open chat");
      }
    } else {
      alert("You can only message accepted connections");
    }
  };

  console.log("ConnectTab - connections:", connections);
  console.log("ConnectTab - connectionsState:", connectionsState);
  console.log("ConnectTab - filteredConnections:", filteredConnections);
  console.log("ConnectTab - connectedConnections:", connectedConnections);
  console.log("ConnectTab - connectedConnections.length:", connectedConnections.length);

  return (
    <div className="flex h-full gap-6">
      {/* Left Side: Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header with Tabs */}
        <div className={`relative mb-6 p-6 rounded-2xl overflow-hidden ${
          isDark 
            ? "bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 border border-slate-700" 
            : "bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-slate-200"
        } backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Professional Network
                </h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Build meaningful connections
                </p>
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="flex gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                isDark ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-sm border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                <span className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'discover'
                  ? isDark
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : isDark
                    ? "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                    : "bg-white/50 text-slate-600 hover:bg-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Discover</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'discover'
                  ? "bg-white/20"
                  : isDark ? "bg-slate-700" : "bg-slate-200"
              }`}>
                {filteredConnections.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'requests'
                  ? isDark
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-orange-500 text-white shadow-lg"
                  : isDark
                    ? "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                    : "bg-white/50 text-slate-600 hover:bg-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Requests</span>
              {pendingRequests.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'requests'
                    ? "bg-white/20"
                    : "bg-orange-500 text-white animate-pulse"
                }`}>
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('connections')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'connections'
                  ? isDark
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 text-white shadow-lg"
                  : isDark
                    ? "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                    : "bg-white/50 text-slate-600 hover:bg-white"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Connected</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'connections'
                  ? "bg-white/20"
                  : isDark ? "bg-slate-700" : "bg-slate-200"
              }`}>
                {connectedConnections.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar - Only show for Discover and Connections tabs */}
        {(activeTab === 'discover' || activeTab === 'connections') && (
          <div className={`mb-6 relative group ${
            isDark ? "bg-slate-800/50" : "bg-white"
          } backdrop-blur-xl rounded-xl border ${
            isDark ? "border-slate-700" : "border-slate-200"
          } p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-slate-700" : "bg-gradient-to-br from-blue-50 to-purple-50"
              }`}>
                <Search className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`} />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'discover' ? "Search professionals..." : "Search your connections..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent border-none focus:outline-none text-base ${
                  isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>
          </div>
        )}

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto pr-2">
          
          {/* DISCOVER TAB */}
          {activeTab === 'discover' && (
            <div>
              {filteredConnections.length === 0 ? (
                <div className={`${
                  isDark ? "bg-slate-800/50" : "bg-white"
                } backdrop-blur-xl rounded-2xl border ${
                  isDark ? "border-slate-700" : "border-slate-200"
                } p-16 text-center shadow-lg`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${
                    isDark ? "bg-slate-700/50" : "bg-gradient-to-br from-blue-50 to-purple-50"
                  } flex items-center justify-center`}>
                    <Users className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {connections.length === 0 ? "No Professionals Available" : "No Results Found"}
                  </h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-base max-w-md mx-auto`}>
                    {connections.length === 0
                      ? "Be the first to grow your network. Check back soon for new connections!"
                      : "Try adjusting your search terms to discover more professionals"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div>
              {pendingRequests.length === 0 ? (
                <div className={`${
                  isDark ? "bg-slate-800/50" : "bg-white"
                } backdrop-blur-xl rounded-2xl border ${
                  isDark ? "border-slate-700" : "border-slate-200"
                } p-16 text-center shadow-lg`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${
                    isDark ? "bg-slate-700/50" : "bg-gradient-to-br from-orange-50 to-red-50"
                  } flex items-center justify-center`}>
                    <Clock className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    No Pending Requests
                  </h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-base max-w-md mx-auto`}>
                    You are all caught up! No connection requests at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request, index) => (
                    <div
                      key={request._id}
                      className={`p-5 rounded-2xl ${
                        isDark 
                          ? "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700" 
                          : "bg-white hover:shadow-lg border border-slate-200"
                      } transition-all duration-200 shadow-md`}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 bg-gradient-to-br ${getGradientColors(request.sender.name)} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <span className="text-white font-bold text-lg">
                              {request.sender.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                              {request.sender.name}
                            </h4>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"} mb-2`}>
                              {request.sender.professionalRole || "Professional"} • {request.sender.currentLocation || "Location not specified"}
                            </p>
                            {request.message && (
                              <div className={`p-3 rounded-xl mt-3 ${
                                isDark ? "bg-slate-700/50" : "bg-slate-50"
                              }`}>
                                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"} italic`}>
                                  &ldquo;{request.message}&rdquo;
                                </p>
                              </div>
                            )}
                            <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"} mt-2`}>
                              {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                              isDark
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            } shadow-md hover:shadow-lg hover:scale-105`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                              isDark
                                ? "bg-slate-700 hover:bg-slate-600 text-white"
                                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            } shadow-md hover:shadow-lg`}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONNECTIONS TAB */}
          {activeTab === 'connections' && (
            <div>
              {connectedConnections.length === 0 ? (
                <div className={`${
                  isDark ? "bg-slate-800/50" : "bg-white"
                } backdrop-blur-xl rounded-2xl border ${
                  isDark ? "border-slate-700" : "border-slate-200"
                } p-16 text-center shadow-lg`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${
                    isDark ? "bg-slate-700/50" : "bg-gradient-to-br from-green-50 to-emerald-50"
                  } flex items-center justify-center`}>
                    <UserCheck className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    No Connections Yet
                  </h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-base max-w-md mx-auto mb-4`}>
                    Start building your professional network by sending connection requests!
                  </p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Discover Professionals
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {connectedConnections
                    .filter((conn) => {
                      if (!searchQuery) return true;
                      return conn.name?.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((conn, index) => (
                      <div
                        key={conn.id}
                        className={`p-5 rounded-2xl ${
                          isDark 
                            ? "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700" 
                            : "bg-white hover:shadow-xl border border-slate-200"
                        } transition-all duration-200 shadow-lg group cursor-pointer`}
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                        }}
                        onClick={() => handleMessage(conn)}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${getGradientColors(conn.name)} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                            <span className="text-white font-bold text-lg">
                              {conn.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-slate-900"} truncate`}>
                              {conn.name}
                            </h4>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"} truncate`}>
                              {conn.title || "Professional"}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessage(conn);
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                            isDark
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          } shadow-md hover:shadow-lg`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Send Message
                        </button>
                        
                        {conn.connectedAt && (
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"} mt-3 text-center`}>
                            Connected {new Date(conn.connectedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Modern Chat Panel */}
      <div className={`w-[420px] ${
        isDark ? "bg-slate-800/50" : "bg-white"
      } backdrop-blur-xl rounded-2xl border ${
        isDark ? "border-slate-700" : "border-slate-200"
      } shadow-2xl overflow-hidden transition-all duration-300`}>
        {selectedConnection ? (
          <ChatBox 
            connection={selectedConnection} 
            isDark={isDark} 
            onClose={() => setSelectedConnection(null)}
            currentChat={currentChat}
            messages={messages}
            sendMessage={sendMessage}
            sendTyping={sendTyping}
            stopTyping={stopTyping}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className={`p-6 ${
              isDark 
                ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-700" 
                : "bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Messages
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isConnected 
                      ? isDark ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-green-100 text-green-700 border border-green-200"
                      : isDark ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
                    {isConnected ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {chats.length} active conversation{chats.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className={`w-20 h-20 rounded-full ${
                    isDark ? "bg-slate-700/50" : "bg-gradient-to-br from-blue-50 to-purple-50"
                  } flex items-center justify-center mb-6`}>
                    <MessageCircle className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    No Messages Yet
                  </h4>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-center text-sm max-w-xs`}>
                    Start connecting with professionals to begin conversations
                  </p>
                  {chatError && <div className={`mt-4 px-4 py-2 rounded-lg ${isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"} text-xs`}>{chatError}</div>}
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {chats.map((chat, index) => {
                    // Only show chats with actual connections
                    const isActualConnection = actualConnections.some(conn => 
                      conn.id === chat.otherParticipant.id
                    );
                    
                    if (!isActualConnection) return null;
                    
                    return (
                      <div
                        key={chat.id}
                        onClick={() => handleMessage({ 
                          id: chat.otherParticipant.id, 
                          name: chat.otherParticipant.name, 
                          connected: true 
                        })}
                        className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          isDark 
                            ? "hover:bg-slate-700/50 hover:shadow-lg" 
                            : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                        } border ${
                          isDark ? "border-transparent hover:border-slate-600" : "border-transparent hover:border-blue-200"
                        }`}
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getGradientColors(chat.otherParticipant.name)} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                              <span className="text-white font-bold">
                                {chat.otherParticipant.name ? chat.otherParticipant.name.charAt(0).toUpperCase() : "U"}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"} truncate`}>
                                {chat.otherParticipant.name}
                              </p>
                              {chat.lastMessageTime && (
                                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                  {new Date(chat.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"} truncate`}>
                              {chat.lastMessage || "Start a conversation..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple ChatBox Component
interface ChatBoxProps {
  connection: Connection;
  isDark: boolean;
  onClose: () => void;
  currentChat: { id: string } | null;
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  sendTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  isLoading: boolean;
}

function ChatBox({ connection, isDark, onClose, currentChat, messages, sendMessage, sendTyping, stopTyping, isLoading }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generate random gradient colors based on name
  const getGradientColors = (name: string) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-teal-500 to-cyan-600",
    ];
    const index = name ? name.length % gradients.length : 0;
    return gradients[index];
  };
  
  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user._id;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    return null;
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() && currentChat) {
      await sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleTyping = () => {
    if (currentChat && !isTyping) {
      setIsTyping(true);
      sendTyping(currentChat.id);
    }
  };

  const handleStopTyping = () => {
    if (currentChat && isTyping) {
      setIsTyping(false);
      stopTyping(currentChat.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Modern Chat Header */}
      <div className={`p-5 ${
        isDark 
          ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-700" 
          : "bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 bg-gradient-to-br ${getGradientColors(connection.name)} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">
                {connection.name ? connection.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                {connection.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Active now</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? "hover:bg-slate-700 text-slate-400 hover:text-white" 
                : "hover:bg-white/60 text-slate-600 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 p-5 overflow-y-auto ${
        isDark ? "bg-slate-800/30" : "bg-slate-50/50"
      }`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm`}>
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`w-16 h-16 rounded-full ${
              isDark ? "bg-slate-700/50" : "bg-gradient-to-br from-blue-50 to-purple-50"
            } flex items-center justify-center mb-4`}>
              <MessageCircle className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            </div>
            <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-center text-sm`}>
              No messages yet. <br />Start the conversation! 👋
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const currentUserId = getCurrentUserId();
              const isOwnMessage = msg.sender.id === currentUserId || msg.sender._id === currentUserId;
              return (
                <div 
                  key={msg.id} 
                  className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-md ${
                      isOwnMessage 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
                        : isDark 
                          ? 'bg-slate-700/80 text-white rounded-bl-md border border-slate-600' 
                          : 'bg-white text-slate-900 rounded-bl-md border border-slate-200'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                      <p className={`text-xs ${
                        isOwnMessage 
                          ? isDark ? 'text-slate-500' : 'text-slate-400'
                          : isDark ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      {isOwnMessage && (
                        <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Modern Input Area */}
      <div className={`p-4 border-t ${
        isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-white"
      }`}>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyUp={handleStopTyping}
              placeholder="Type your message..."
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                isDark 
                  ? "bg-slate-700/50 border-slate-600 focus:border-blue-500 text-white placeholder:text-slate-500" 
                  : "bg-slate-50 border-slate-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400"
              }`}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-xl transition-all duration-200 ${
              newMessage.trim()
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : isDark 
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
