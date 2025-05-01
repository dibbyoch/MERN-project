const cleanOutput = (output) => {
  if (typeof output !== "string") {
    return output;
  }

  if (output.includes("\r\n")) {
    output = output.replace(/\r\n/g, "\n");
  }

  return output.trim();
};

module.exports = { cleanOutput };
