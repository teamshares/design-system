// Provides a shared base tailwind config for all Teamshares apps
// Note: to load new changes in this file, the consuming app's asset pipeline may need to be restarted

// Load the JSON tokens from Shoelace; they are already structured in Tailwind config format
const tokens = require("@teamshares/shoelace/dist/styles/tokens.json");
// Then inject the typography plugin config
tokens.typography = {
  tsprose: {
    css: {
      "--tw-prose-body": "var(--ts-colors-gray-900)",
      "--tw-prose-headings": "var(--ts-colors-gray-900)",
      "--tw-prose-lead": "var(--ts-colors-gray-700)",
      "--tw-prose-links": "var(--ts-colors-blue-700)",
      "--tw-prose-bold": "var(--ts-colors-gray-900)",
      "--tw-prose-counters": "var(--ts-colors-gray-600)",
      "--tw-prose-bullets": "var(--ts-colors-gray-600)",
      "--tw-prose-hr": "var(--ts-colors-gray-300)",
      "--tw-prose-quotes": "var(--ts-colors-gray-900)",
      "--tw-prose-quote-borders": "var(--ts-colors-gray-300)",
      "--tw-prose-captions": "var(--ts-colors-gray-700)",
      "--tw-prose-code": "var(--ts-colors-gray-900)",
      "--tw-prose-pre-code": "var(--ts-colors-gray-100)",
      "--tw-prose-pre-bg": "var(--ts-colors-gray-900)",
      "--tw-prose-th-borders": "var(--ts-colors-gray-300)",
      "--tw-prose-td-borders": "var(--ts-colors-gray-200)",
      a: {
        color: "var(--ts-colors-blue-600)",
        fontWeight: "400",
        textUnderlineOffset: "4px",
        transition: "all 300ms ease-in-out",
        "&:hover": {
          color: "var(--ts-colors-blue-700)",
          textDecorationColor: "transparent",
        },
      },
    },
  },
};

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
