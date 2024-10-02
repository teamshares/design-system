const tailwindDefaultConfig = require("./tailwind.config.js");
const prefixComponentClasses = require("./postcss/prefix-component-classes.js");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
console.log(`Preparing to bundle CSS in ${isProd ? "PRODUCTION" : "development mode"}`);
APP_ROOT = process.cwd();

// TODO: this is hardcoding for the health insurance onboarding engine - remove when app is extracted from OS
TEMP_HEALTH_INSURANCE_APP = `${APP_ROOT}/health_insurance`;

const { getTeamsharesRailsPath } = require("../lib/teamshares-rails-path");
const tsRailsPath = getTeamsharesRailsPath();

const injectSharedCodePaths = (config) => {
  config.content.push(`${tsRailsPath}/{app,lib}/**/*.{html,js,rb,erb,slim,scss}`);
  config.content.push(`${TEMP_HEALTH_INSURANCE_APP}/app/**/*.{html,js,rb,erb,slim,scss}`);

  return config;
};

const defaultConfigTransformer = (config) => config;

const configBuilder = (tailwindConfigTransformer = defaultConfigTransformer) => {
  const baseConfig = injectSharedCodePaths(Object.assign({}, tailwindDefaultConfig));
  const tailwindConfig = tailwindConfigTransformer(baseConfig);

  const postcssConfig = {
    parser: "postcss-scss",
    plugins: [
      require('postcss-mixins'),
      require("postcss-easy-import")({ path: [tsRailsPath, APP_ROOT, TEMP_HEALTH_INSURANCE_APP], prefix: "_", extensions: [".css", ".scss"], plugins: [
        require("tailwindcss/nesting"),
        prefixComponentClasses,
      ] }),
      require("tailwindcss")(tailwindConfig),
      require("postcss-flexbugs-fixes"),
      require("postcss-preset-env")({
        autoprefixer: {
          flexbox: "no-2009",
        },
        features: {
          "nesting-rules": false, // Will be handled by tailwindcss/nesting, instead
        },
        stage: 3,
      }),
      isProd ? require("cssnano")({ preset: "default" }) : null,
      require("postcss-reporter")({ clearReportedMessages: true }),
    ].filter(Boolean),
  };

  return postcssConfig;
};

module.exports = { configBuilder };
