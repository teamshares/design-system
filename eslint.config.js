const { buildConfigs } = require("./configs/eslint.config.js");

const { browserConfig, nodeConfig } = buildConfigs();

module.exports = [
  "eslint:recommended",
  {
    files: ["eslint.config.js", "configs/*.config.js", "bin/*.js"],
    ...nodeConfig,
  },
  {
    files: ["js/**/*.js"],
    ...browserConfig,
  },
];
