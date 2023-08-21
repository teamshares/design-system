// Provides a shared base tailwind config for all Teamshares apps
// Note: to load new changes in this file, the consuming app's asset pipeline may need to be restarted

const tokens = require("@teamshares/shoelace/dist/styles/tokens.json");

const tailwindConfig = {
  content: [ // NOTE: When used within Rails apps, shared-ui and shared-rails-engine paths are dynamically injected as well
    "app/**/*.{html,js,rb,erb,slim}",
    "app/assets/stylesheets/**/*.scss",
    "config/initializers/simple_form.rb",
    "public/*.html",
  ],
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
  theme: {
    extend: tokens,
  },
};

module.exports = tailwindConfig;
