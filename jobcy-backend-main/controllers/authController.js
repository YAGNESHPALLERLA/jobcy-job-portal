const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

// User registration (normal users)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, careerStatus } = req.body;
    const role = req.body.role || "user";

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    if (role !== 'admin' && !name) {
      return res.status(400).json({ error: "Name is required." });
    }

    if (role === "user" && !mobile) {
      return res.status(400).json({ error: "Mobile number is required for users." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: role === 'admin' ? email.split('@')[0] : name, // default name for admin
      email,
      mobile: role === "user" ? (mobile ? Number(mobile) : undefined) : undefined,
      password: hashedPassword,
      role,
      careerStatus: role === "user" ? careerStatus : undefined,
      company: req.body.company,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Register User Error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error." });
  }
};

// HR registration (by admin)
exports.registerHR = async (req, res) => {
  try {
    console.log("Register HR request body:", req.body);
    const { name, email, password, company, phone, companyId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ error: "Password is required." });
    }
    if (!company || !company.name || !company.name.trim()) {
      return res.status(400).json({ error: "Company name is required." });
    }

    const existingHR = await User.findOne({ email });
    if (existingHR) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Trim values
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCompanyName = company.name.trim();

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const hr = new User({
      name: trimmedName,
      email: trimmedEmail,
      mobile: phone ? Number(phone) : undefined,
      password: hashedPassword,
      role: "hr",
      company: {
        ...company,
        name: trimmedCompanyName,
      },
      companyId: companyId || undefined, // Link to Company model if provided
      createdByAdmin: req.user.id,
    });

    await hr.save();
    res.status(201).json({ message: "HR registered successfully.", hr });
  } catch (err) {
    console.error("Register HR Error:", err);
    res.status(500).json({ error: "Internal server error.", details: err.message });
  }
};

// Company registration
exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = new Company({ name, email, password: hashedPassword });
    await company.save();

    res.status(201).json({ message: "Company registered successfully." });
  } catch (err) {
    console.error("Register Company Error:", err);
    res.status(500).json({ error: "Internal server error.", details: err.message });
  }
};

// Unified login (user, hr, admin)
exports.loginUserUnified = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    let user = await User.findOne({ email });
    let role;

    if (user) {
      role = user.role;
    } else {
      // Check Company model for admin
      const company = await Company.findOne({ email });
      if (company) {
        user = company;
        role = "admin";
      }
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const payload = { id: user._id, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        company: user.company || null,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Company login (optional)
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const company = await Company.findOne({ email });
    if (!company) return res.status(401).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: company._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: company._id,
        name: company.name,
        email: company.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Company Login Error:", err);
    res.status(500).json({ error: "Internal server error.", details: err.message });
  }
};
