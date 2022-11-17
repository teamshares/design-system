const { browserConfig, nodeConfig } = require("./configs/eslint.config.js");

module.exports = [
  "eslint:recommended",
  {
    files: ["eslint.config.js", "configs/*.config.js", "bin/*.js"],
    ...nodeConfig,
  },
  {
    files: ["src/**/*.js"],
    ...browserConfig,
  },
];
