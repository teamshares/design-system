const { buildConfigs } = require("./configs/eslint.config.js");

const { browserConfig, nodeConfig } = buildConfigs();

module.exports = [
  {
    files: ["*.config.js", "lib/teamshares-rails-path.js"],
    ...nodeConfig,
  },
  {
    files: ["rails-js/**/*.js"],
    ...browserConfig,
  },
];
