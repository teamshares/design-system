const fs = require("fs");
const cachePath = "tmp/.cached-teamshares-rails-path";

const getTeamsharesRailsPath = () => {
  try {
    return fs.readFileSync(cachePath).toString();
  } catch (err) {
    const gemPath = require("child_process").execSync("bundle show teamshares_rails").toString().trim();
    fs.writeFileSync(cachePath, gemPath);
    return gemPath;
  }
};

module.exports = {
  getTeamsharesRailsPath,
};
