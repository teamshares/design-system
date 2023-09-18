const { buildConfigs } = require("./configs/eslint.config.js");

const { nodeConfig } = buildConfigs();

module.exports = [
  {
    files: ["*.config.js", "lib/teamshares-rails-path.js"],
    ...nodeConfig,
  },
];
