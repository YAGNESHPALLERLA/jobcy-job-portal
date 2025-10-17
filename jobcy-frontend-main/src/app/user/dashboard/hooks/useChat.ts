"use client";
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface Chat {
  id: string;
  otherParticipant: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: string;
  lastMessageTime: string;
}

export function useChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: {
        token: token
      }
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });

    newSocket.on("new-message", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on("user-typing", (data) => {
      console.log(`${data.userName} is typing...`);
    });

    newSocket.on("user-stop-typing", (data) => {
      console.log(`${data.userName} stopped typing`);
    });

    newSocket.on("message-error", (error) => {
      setError(error.error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Get all chats for the user
  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else {
        setError("Failed to fetch chats");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get or create a chat with a specific user
  const getOrCreateChat = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Find the other participant (the one matching the userId we're chatting with)
        // Backend returns participants with _id field
        interface Participant {
          _id?: string;
          id?: string;
          name?: string;
          email?: string;
        }
        const otherParticipant = data.chat.participants.find((p: Participant) => p._id === userId || p.id === userId);
        const chat = {
          id: data.chat.id,
          otherParticipant: {
            id: otherParticipant?._id || otherParticipant?.id || userId,
            name: otherParticipant?.name || 'Unknown',
            email: otherParticipant?.email || ''
          },
          lastMessage: data.chat.lastMessage,
          lastMessageTime: data.chat.lastMessageTime
        };
        setCurrentChat(chat);
        return chat;
      } else {
        setError("Failed to create chat");
        return null;
      }
    } catch {
      setError("Network error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get messages for a specific chat
  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        setError("Failed to fetch messages");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = async (content: string) => {
    if (!socket || !currentChat) return;

    try {
      // Send via Socket.IO for real-time delivery
      // The server will save to DB and broadcast to all participants
      socket.emit("send-message", {
        chatId: currentChat.id,
        content: content
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  // Join a chat room
  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit("join-chat", chatId);
    }
  };

  // Leave a chat room
  const leaveChat = (chatId: string) => {
    if (socket) {
      socket.emit("leave-chat", chatId);
    }
  };

  // Send typing indicator
  const sendTyping = (chatId: string) => {
    if (socket) {
      socket.emit("typing", { chatId });
    }
  };

  // Stop typing indicator
  const stopTyping = (chatId: string) => {
    if (socket) {
      socket.emit("stop-typing", { chatId });
    }
  };

  return {
    socket,
    isConnected,
    chats,
    currentChat,
    messages,
    isLoading,
    error,
    fetchChats,
    getOrCreateChat,
    fetchMessages,
    sendMessage,
    joinChat,
    leaveChat,
    sendTyping,
    stopTyping,
    setCurrentChat,
    setMessages
  };
}
