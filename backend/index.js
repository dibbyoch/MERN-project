const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DBConnection } = require("./database/db");
const User = require("./model/user");
const app = express();
const cookieParser = require("cookie-parser");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    console.log(firstname, lastname, email, password);

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).send("Please fill all the fields");
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the data to the database
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Generate a token for the user
    const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    newUser.token = token;
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in registering user", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    // get all the data from the request body
    const { email, password } = req.body;
    console.log(email, password);

    //check that the data is not empty
    if (!email || !password) {
      return res.status(400).send("Please fill all the fields");
    }
    // find the user in the database using the email
    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      return res.status(400).send("User not found,Please register first");
    }
    // match/compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, loginUser.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    // store cookies and send the token to the client
    const token = jwt.sign(
      // Generate a token for the user
      { id: loginUser._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );
    res.cookie("authToken", token, {
      //added cookie
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 4 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error in logging in user", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
