require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);
  
  // Initialize Socket.IO
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(new Error("Authentication error"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Handle joining chat rooms
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.user.name} joined chat ${chatId}`);
    });

    // Handle leaving chat rooms
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.user.name} left chat ${chatId}`);
    });

    // Handle sending messages
    socket.on("send-message", async (data) => {
      try {
        const { chatId, content } = data;
        
        // Save message to database
        const Message = require("./models/Message");
        const Chat = require("./models/Chat");
        
        const message = new Message({
          chatId,
          sender: socket.userId,
          content: content.trim()
        });
        
        await message.save();
        await message.populate('sender', 'name email');

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: content,
          lastMessageTime: new Date()
        });

        // Emit message to all users in the chat room
        io.to(chatId).emit("new-message", {
          id: message._id,
          content: message.content,
          sender: {
            id: message.sender._id,
            name: message.sender.name,
            email: message.sender.email
          },
          isRead: message.isRead,
          createdAt: message.createdAt
        });

        console.log(`Message sent in chat ${chatId} by ${socket.user.name}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message-error", { error: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      socket.to(data.chatId).emit("user-typing", {
        userId: socket.userId,
        userName: socket.user.name,
        chatId: data.chatId
      });
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.chatId).emit("user-stop-typing", {
        userId: socket.userId,
        chatId: data.chatId
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO server ready`);
  });
};

startServer();
