const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

// Send connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot send connection request to yourself" });
    }

    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "Users are already connected" });
      }
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "Connection request already exists" });
      }
    }

    const connectionRequest = new ConnectionRequest({
      sender: senderId,
      receiver: receiverId,
      message: message || "",
    });

    await connectionRequest.save();

    // Create notification for receiver
    const sender = await User.findById(senderId).select("name");
    await User.findByIdAndUpdate(receiverId, {
      $push: {
        notifications: {
          type: "connection_request",
          title: "New Connection Request",
          message: `${sender.name} sent you a connection request`,
          relatedUser: senderId,
        }
      }
    });

    res.status(201).json({
      message: "Connection request sent successfully",
      request: connectionRequest
    });
  } catch (error) {
    console.error("Send connection request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get received connection requests
exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: "pending"
    })
    .populate("sender", "name email professionalRole currentLocation")
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Get received requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get sent connection requests
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      sender: userId,
      status: "pending"
    })
    .populate("receiver", "name email professionalRole currentLocation")
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Get sent requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept connection request
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await ConnectionRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    request.status = "accepted";
    await request.save();

    // Update both users' connections count
    await User.findByIdAndUpdate(userId, { $inc: { connections: 1 } });
    await User.findByIdAndUpdate(request.sender, { $inc: { connections: 1 } });

    // Create notification for sender
    const receiver = await User.findById(userId).select("name");
    await User.findByIdAndUpdate(request.sender, {
      $push: {
        notifications: {
          type: "connection_accepted",
          title: "Connection Request Accepted",
          message: `${receiver.name} accepted your connection request`,
          relatedUser: userId,
        }
      }
    });

    res.json({ message: "Connection request accepted" });
  } catch (error) {
    console.error("Accept connection request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject connection request
exports.rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await ConnectionRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Connection request rejected" });
  } catch (error) {
    console.error("Reject connection request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user connections
exports.getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" }
      ]
    })
    .populate("sender", "name email professionalRole currentLocation")
    .populate("receiver", "name email professionalRole currentLocation")
    .sort({ updatedAt: -1 });

    // Format connections to return the other user
    const formattedConnections = connections.map(conn => {
      const otherUser = conn.sender._id.toString() === userId.toString()
        ? conn.receiver
        : conn.sender;
      return {
        id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        title: otherUser.professionalRole || "Professional",
        location: otherUser.currentLocation || "Unknown location",
        avatar: otherUser.name?.[0]?.toUpperCase() || "U",
        connected: true,
        connectedAt: conn.updatedAt
      };
    });

    res.json(formattedConnections);
  } catch (error) {
    console.error("Get user connections error:", error);
    res.status(500).json({ message: "Server error" });
  }
};