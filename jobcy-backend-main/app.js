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

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL, // Your Vercel URL
];

// Allow all Vercel preview deployments
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed origins or is a Vercel preview deployment
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
