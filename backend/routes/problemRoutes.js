const express = require("express");
const router = express.Router();
const Problem = require("../model/problem");
const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");

// Create a new problem
router.post("/", async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all problems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific problem
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a problem
router.put("/:id", async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a problem
router.delete("/:id", async (req, res) => {
  try {
    const { username, password } = req.body;
    const problemId = req.params.id;

    // Step 1: Check for admin user
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(403).json({ message: "Admin user not found" });
    }

    // Step 2: Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect admin credentials" });
    }

    // Step 3: Delete the problem
    const deletedProblem = await Problem.findByIdAndDelete(problemId);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
