const fs = require("fs");
const cachePath = "tmp/.cached-teamshares-rails-path";

const getTeamsharesRailsPath = () => {
  try {
    const cachedPath = fs.readFileSync(cachePath).toString();

    // NOTE: throws if path doesn't exist (e.g. gem has been updated)
    fs.readdirSync(cachedPath);

    return cachedPath;
  } catch (err) {
    const gemPath = require("child_process").execSync("bundle show teamshares_rails").toString().trim();
    fs.writeFileSync(cachePath, gemPath);
    return gemPath;
  }
};

module.exports = {
  getTeamsharesRailsPath,
};
