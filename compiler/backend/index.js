const express = require("express");

// Initialize the app
const app = express();

// Import other necessary modules
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executeC } = require("./executeC");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const filePath = await generateFile(language, code);

    let output;
    if (language === "cpp") output = await executeCpp(filePath, input);
    else if (language === "c") output = await executeC(filePath, input);
    else if (language === "py") output = await executePy(filePath, input);
    else if (language === "java") output = await executeJava(filePath, input);
    else throw new Error("Unsupported language");

    res.status(200).json({ filePath, output });
  } catch (error) {
    console.error("Execution Error:", error); // 👈 LOG THIS
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
