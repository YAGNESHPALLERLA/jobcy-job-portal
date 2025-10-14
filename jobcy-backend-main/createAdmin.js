const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust path if needed
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;
    const adminMobile = process.env.ADMIN_MOBILE;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      // Update existing admin
      adminExists.password = hashedPassword;
      adminExists.name = adminName;
      adminExists.mobile = adminMobile;
      await adminExists.save();
      console.log("Admin user updated successfully with email:", adminEmail);
    } else {
      // Create new admin
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        mobile: adminMobile,
      });
      await adminUser.save();
      console.log(`Admin user created successfully with email: ${adminEmail}`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
