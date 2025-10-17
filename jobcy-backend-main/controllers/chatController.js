const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// Get or create a chat between two users
exports.getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] }
    }).populate('participants', 'name email');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [currentUserId, userId]
      });
      await chat.save();
      await chat.populate('participants', 'name email');
    }

    res.json({
      success: true,
      chat: {
        id: chat._id,
        participants: chat.participants,
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime
      }
    });
  } catch (error) {
    console.error("Error getting/creating chat:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'name email')
    .sort({ lastMessageTime: -1 });

    // Format chats to exclude current user from participants
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId.toString()
      );
      
      return {
        id: chat._id,
        otherParticipant: {
          id: otherParticipant._id,
          name: otherParticipant.name,
          email: otherParticipant.email
        },
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime
      };
    });

    res.json({
      success: true,
      chats: formattedChats
    });
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get messages for a specific chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.find({ chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages: messages.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: {
          id: msg.sender._id,
          name: msg.sender.name,
          email: msg.sender.email
        },
        isRead: msg.isRead,
        createdAt: msg.createdAt
      }))
    });
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user._id;

    // Verify user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId
    });

    if (!chat) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Create new message
    const message = new Message({
      chatId,
      sender: senderId,
      content: content.trim()
    });

    await message.save();
    await message.populate('sender', 'name email');

    // Update chat's last message
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();
    await chat.save();

    res.json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        sender: {
          id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email
        },
        isRead: message.isRead,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Mark all messages in this chat as read (except user's own messages)
    await Message.updateMany(
      { 
        chatId, 
        sender: { $ne: userId },
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

