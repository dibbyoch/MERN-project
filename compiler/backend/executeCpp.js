const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { cleanOutput } = require("./cleanOutput");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

const executeCpp = (filePath, input = "") => {
  const jobID = path.basename(filePath, ".cpp");
  const outputFilePath = path.join(outputPath, `${jobID}.exe`);
  const inputFilePath = path.join(outputPath, `${jobID}.txt`);
  fs.writeFileSync(inputFilePath, input);

  const command = `g++ ${filePath} -o ${outputFilePath} && ${outputFilePath} < ${inputFilePath}`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error.message);
      if (stderr) return reject(stderr);
      resolve(cleanOutput(stdout));
    });
  });
};

module.exports = { executeCpp };
