const fs = require("fs");
const path = require("path");
const cachePath = "tmp/.cached-teamshares-rails-path";

const getBasePath = () => {
  try {
    return fs.readFileSync(cachePath);
  } catch (err) {
    const gemPath = require("child_process").execSync("bundle show teamshares_rails").toString().trim();
    fs.writeFileSync(cachePath, gemPath);
    return gemPath;
  }
};

const getSharedConfigPath = (callerFile) => `${getBasePath()}/shared-tool-configs/${path.basename(callerFile)}`;

const requireSharedConfig = (callerFile) => {
  const sharedConfigPath = getSharedConfigPath(callerFile);
  return require(sharedConfigPath);
};

module.exports = {
  requireSharedConfig,
};
