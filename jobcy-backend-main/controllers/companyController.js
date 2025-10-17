const Company = require("../models/Company");
const bcrypt = require("bcryptjs");

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    console.log("📋 Admin fetching all companies");
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const companies = await Company.find()
      .select("-password")
      .populate("registeredBy", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${companies.length} companies`);

    res.json(companies);
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single company
exports.getCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    
    const company = await Company.findById(companyId)
      .select("-password")
      .populate("registeredBy", "name email");
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("❌ Error fetching company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new company (Admin only)
exports.createCompany = async (req, res) => {
  try {
    console.log("🏢 Admin creating company:", req.body.name);
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      name,
      email,
      password,
      industry,
      location,
      website,
      description,
      size,
      status,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if company email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Company email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = new Company({
      name,
      email,
      password: hashedPassword,
      industry,
      location,
      website,
      description,
      size,
      status: status || "Active",
      registeredBy: req.user._id,
    });

    await company.save();

    console.log("✅ Company created successfully:", company._id);

    // Return company without password
    const companyResponse = await Company.findById(company._id)
      .select("-password")
      .populate("registeredBy", "name email");

    res.status(201).json({
      message: "Company registered successfully",
      company: companyResponse,
    });
  } catch (error) {
    console.error("❌ Error creating company:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    console.log("✏️ Admin updating company:", companyId);
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const {
      name,
      email,
      password,
      industry,
      location,
      website,
      description,
      size,
      status,
    } = req.body;

    // Update fields
    if (name) company.name = name;
    if (email) company.email = email;
    if (industry) company.industry = industry;
    if (location) company.location = location;
    if (website) company.website = website;
    if (description) company.description = description;
    if (size) company.size = size;
    if (status) company.status = status;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      company.password = await bcrypt.hash(password, salt);
    }

    await company.save();

    console.log("✅ Company updated successfully:", companyId);

    // Return company without password
    const updatedCompany = await Company.findById(companyId)
      .select("-password")
      .populate("registeredBy", "name email");

    res.json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("❌ Error updating company:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    console.log("🗑️ Admin deleting company:", companyId);
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    console.log("✅ Company deleted successfully:", companyId);

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get company statistics
exports.getCompanyStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalCompanies = await Company.countDocuments();
    const activeCompanies = await Company.countDocuments({ status: "Active" });
    const pendingCompanies = await Company.countDocuments({ status: "Pending" });

    res.json({
      totalCompanies,
      activeCompanies,
      pendingCompanies,
    });
  } catch (error) {
    console.error("❌ Error fetching company stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

