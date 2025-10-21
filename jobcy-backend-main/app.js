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
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:3001',
//   // process.env.FRONTEND_URL,
//    'https://jobcy-job-portal.vercel.app'
// ];

// Allow all Vercel preview deployments
// app.use(cors({
//   origin: function (origin, callback) {
//     console.log('CORS request from origin:', origin);
    
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) {
//       console.log('No origin provided, allowing request');
//       return callback(null, true);
//     }
    
//     // Check if origin is in allowed origins or is a Vercel preview deployment
//     if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
//       console.log('Origin allowed:', origin);
//       callback(null, true);
//     } else {
//       console.log('Origin blocked:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
// }));

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
// Health check endpoint for Railway
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Job Portal API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

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
