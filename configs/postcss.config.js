const tailwindConfig = require("./tailwind.config.js");

// purge is for tailwind v2, content is for v3
// teamsharesUiConfig.purge = teamsharesUiConfig.content;
tailwindConfig.content = undefined;
tailwindConfig.purge = {
  enabled: true,
  content: [
    "app/**/*.{html,js,rb,erb,slim}",
    "app/assets/stylesheets/**/*.scss",
    "public/*.html"
  ]
};

module.exports = {
  parser: "postcss-scss",
  plugins: [
    require("postcss-easy-import")({ prefix: "_", extensions: [".css", ".scss"] }),
    require("postcss-nested-vars"),
    require("tailwindcss/nesting"),
    require("tailwindcss")(tailwindConfig),
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009"
      },
      features: {
        "nesting-rules": false // Will be handled by tailwindcss/nesting, instead
      },
      stage: 3
    })
  ]
};
