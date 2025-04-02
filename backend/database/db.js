const mongoose = require("mongoose");
require("dotenv").config();

const DBConnection = async () => {
  const MONGODB_URL = process.env.mongodb_uri;
  console.log(MONGODB_URL);
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);
  }
};

module.exports = { DBConnection };
