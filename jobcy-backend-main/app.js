const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hrRoutes = require("./routes/hrRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const educationRoutes = require("./routes/educationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const chatRoutes = require("./routes/chatRoutes");
const companyRoutes = require("./routes/companyRoutes");
const companyDashboardRoutes = require("./routes/companyDashboardRoutes");

require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Import routes
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes); // Add this for backward compatibility
app.use("/api/jobs", jobRoutes);
app.use("/api", educationRoutes);
app.use("/api", experienceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin/companies", companyRoutes);
app.use("/api/company", companyDashboardRoutes);

module.exports = app;
