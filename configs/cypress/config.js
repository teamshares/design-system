const { defineConfig } = require("cypress");
const cypressSplit = require("cypress-split");
const path = require("path");

const pluginPath = path.join(process.cwd(), "cypress/plugins/index.js")

const defaultConfig = {
  screenshotsFolder: "tmp/cypress_screenshots",
  videosFolder: "tmp/cypress_videos",
  trashAssetsBeforeRuns: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  chromeWebSecurity: false,
  e2e: {
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    experimentalStudio: true,

    setupNodeEvents (on, config) {
      require(pluginPath)(on, config);
      cypressSplit(on, config);
      return config;
    },
  },
}

const defineConfigWithTeamsharesDefaults = (overrides) => {
  if (!overrides || !overrides.projectId) {
    throw new Error("You must provide a projectId (and optionally config overrides) when calling defineConfigWithTeamsharesDefaults");
  }

  return defineConfig(Object.assign({}, defaultConfig, overrides));
}

module.exports = {
  defineConfigWithTeamsharesDefaults
};

