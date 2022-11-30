const tailwindConfig = require("./tailwind.config.js");

const postcssConfig = {
  parser: "postcss-scss",
  plugins: [
    require("postcss-easy-import")({ prefix: "_", extensions: [".css", ".scss"] }),
    require("postcss-nested-vars"),
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
    require("cssnano")({ preset: "default" }),
    require("postcss-reporter")({ clearReportedMessages: true }),
  ],
};

module.exports = postcssConfig;
