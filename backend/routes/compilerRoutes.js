const express = require("express");
const router = express.Router();

const { generateFile } = require("../compiler/generateFile");
const { executeCpp } = require("../compiler/executeCpp");
const { executeC } = require("../compiler/executeC");
const { executePy } = require("../compiler/executePy");
const { executeJava } = require("../compiler/executeJava");

router.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) return res.status(400).json({ error: "Code is required" });

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
    console.error("Execution Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

module.exports = router;
