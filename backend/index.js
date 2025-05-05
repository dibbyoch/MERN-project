const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DBConnection } = require("./database/db");
const User = require("./model/user");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email },
      process.env.JWT_SECRET || "fallbacksecret",
      {
        expiresIn: "4h",
      }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET || "fallbacksecret",
      {
        expiresIn: "4h",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 4 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
