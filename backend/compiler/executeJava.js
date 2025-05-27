const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { cleanOutput } = require("./cleanOutput");

const executeJava = (filePath, input = "") => {
  const jobID = path.basename(filePath, ".java");
  const dir = path.dirname(filePath);
  const inputPath = `${filePath}_input.txt`;

  fs.writeFileSync(inputPath, input);

  const command = `javac ${filePath} && java -cp ${dir} ${jobID} < ${inputPath}`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      fs.unlinkSync(inputPath);
      if (error) return reject(error.message);
      if (stderr) return reject(stderr);
      resolve(cleanOutput(stdout));
    });
  });
};

module.exports = { executeJava };
