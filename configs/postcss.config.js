const tailwindConfig = require("./tailwind.config.js");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
console.log(`Preparing to bundle CSS in ${isProd ? "PRODUCTION" : "development mode"}`);

const postcssConfig = {
  parser: "postcss-scss",
  plugins: [
    require("postcss-easy-import")({ prefix: "_", extensions: [".css", ".scss"] }),
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

module.exports = postcssConfig;