const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No authorization header");
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Token decoded:", { id: decoded.id, role: decoded.role });
    
    // Try to find user first
    let user = await User.findById(decoded.id).select("-password");
    
    // If not found in User model, try Company model
    if (!user) {
      console.log("👤 User not found in User model, checking Company model");
      user = await Company.findById(decoded.id).select("-password");
      // If it's a company, add the role from the token since Company model doesn't have role field
      if (user) {
        user = user.toObject(); // Convert to plain object
        user.role = decoded.role || "admin"; // Add role from JWT token
        console.log("🏢 Company user found, role set to:", user.role);
      }
    } else {
      console.log("👤 User found in User model, role:", user.role);
    }
    
    if (!user) {
      console.log("❌ User not found in either model");
      return res.status(401).json({ message: "User not found" });
    }
    
    console.log("✅ Auth successful for user:", user._id, "role:", user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.authenticate = exports.protect;

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
};

exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔒 Role check - Required roles:", roles, "User role:", req.user?.role);
    
    if (!req.user) {
      console.log("❌ No user in request");
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log("❌ Access denied - User role", req.user.role, "not in", roles);
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    
    console.log("✅ Role check passed for", req.user.role);
    next();
  };
};
