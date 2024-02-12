const tailwindDefaultConfig = require("./tailwind.config.js");
const prefixComponentClasses = require("./postcss/prefix-component-classes.js");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
console.log(`Preparing to bundle CSS in ${isProd ? "PRODUCTION" : "development mode"}`);
APP_ROOT = process.cwd();

const { getTeamsharesRailsPath } = require("../lib/teamshares-rails-path");
const tsRailsPath = getTeamsharesRailsPath();

const injectSharedCodePaths = (config) => {
  config.content.push(`${tsRailsPath}/{app,lib}/**/*.{html,js,rb,erb,slim,scss}`);

  return config;
};

const defaultConfigTransformer = (config) => config;

const configBuilder = (tailwindConfigTransformer = defaultConfigTransformer) => {
  const baseConfig = injectSharedCodePaths(Object.assign({}, tailwindDefaultConfig));
  const tailwindConfig = tailwindConfigTransformer(baseConfig);

  const postcssConfig = {
    parser: "postcss-scss",
    plugins: [
      require("postcss-easy-import")({ path: [tsRailsPath, APP_ROOT], prefix: "_", extensions: [".css", ".scss"], plugins: [
        prefixComponentClasses,
      ] }),
      require("tailwindcss/nesting"),
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
