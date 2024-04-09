// Note: previously we cached the path to the teamshares_rails gem, but that introduced
// versioning bugs since bundler is appending the SHA to the path on disk.

const getTeamsharesRailsPath = () => require("child_process").execSync("bundle show teamshares_rails").toString().trim();

module.exports = {
  getTeamsharesRailsPath,
};
