const { buildConfigs } = require("./configs/eslint.config.js");

const { browserConfig, nodeConfig, cypressConfig } = buildConfigs();

module.exports = [
  {
    files: ["configs/cypress/*.js"],
    ...cypressConfig,
  },
  {
    files: ["*.config.js", "lib/teamshares-rails-path.js"],
    ...nodeConfig,
  },
  {
    files: ["rails-js/**/*.js"],
    ...browserConfig,
  },
];
