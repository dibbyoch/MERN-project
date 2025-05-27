const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { cleanOutput } = require("./cleanOutput");

const executePy = (filePath, input = "") => {
  const inputPath = `${filePath}_input.txt`;
  fs.writeFileSync(inputPath, input);

  const command = `python ${filePath} < ${inputPath}`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      fs.unlinkSync(inputPath);
      if (error) return reject(error.message);
      if (stderr) return reject(stderr);
      resolve(cleanOutput(stdout));
    });
  });
};

module.exports = { executePy };
