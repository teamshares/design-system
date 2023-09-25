const fs = require("fs");
const cachePath = "tmp/.cached-teamshares-rails-path";

const findTeamsharesRailsPathHeroku = () => {
  const path = "/app/vendor/bundle/ruby";
  const rubyVersion = fs.readdirSync(path)[0];
  const rubyPath = `/app/vendor/bundle/ruby/${rubyVersion}/gems`;
  const gems = fs.readdirSync(rubyPath);

  gems.forEach(gem => {
    if (gem.startsWith("teamshares-rails-")) {
      return `${rubyPath}/${gem}`;
    }
  });

  throw new Error("Could not find teamshares-rails gem path");
};

const findTeamsharesRailsPath = () => {
  if (process.env.HEROKU_APP_NAME) {
    // Unfortunately on heroku we have to run nodejs buildpack *before* ruby buildpack (in order to specify non-default node version),
    // which means we have to find the path ourselves.
    return findTeamsharesRailsPathHeroku();
  }

  return require("child_process").execSync("bundle show teamshares_rails").toString().trim();
};

const getTeamsharesRailsPath = () => {
  try {
    return fs.readFileSync(cachePath).toString();
  } catch (err) {
    const gemPath = findTeamsharesRailsPath();
    fs.writeFileSync(cachePath, gemPath);
    return gemPath;
  }
};

module.exports = {
  getTeamsharesRailsPath,
};
