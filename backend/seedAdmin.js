const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./model/admin"); // or "./models/admin" depending on your folder name
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.mongodb_uri);

    const username = "admin";
    const plainPassword = "Welcome@123";

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await Admin.create({ username, password: hashedPassword });

    console.log("✅ Admin user created successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
