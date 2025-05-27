const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes);
}

// Mapping language to correct file extension
const languageToExtension = {
  cpp: "cpp",
  c: "c",
  py: "py",
  java: "java",
};

const generateFile = async (language, code) => {
  const extension = languageToExtension[language];
  if (!extension) {
    throw new Error("Unsupported language for file generation.");
  }

  const jobID = uuid();
  const fileName = `${jobID}.${extension}`;
  const filePath = path.join(dirCodes, fileName);

  fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = { generateFile };
