const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Try MONGODB_URI first (Railway standard), then MONGO_URI as fallback
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error("❌ No MongoDB URI found. Please set MONGODB_URI or MONGO_URI environment variable.");
      process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB...");
    console.log("📍 URI:", mongoUri.replace(/\/\/.*@/, "//***:***@")); // Hide credentials in logs
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log("🌍 Database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("🔍 Full error:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
