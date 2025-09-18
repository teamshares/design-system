const { defineConfig } = require("cypress");
const cypressSplit = require("cypress-split");

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
  defaultCommandTimeout: 10000,
  e2e: {
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    baseUrl: "http://localhost:5678",
    experimentalStudio: true,
    experimentalRunAllSpecs: true,

    setupNodeEvents (on, config) {
      cypressSplit(on, config);
      return config;
    },
  },
};

const defineConfigWithTeamsharesDefaults = (overrides = {}) => {
  return defineConfig(Object.assign({}, defaultConfig, overrides));
};

module.exports = {
  defineConfigWithTeamsharesDefaults,
};
