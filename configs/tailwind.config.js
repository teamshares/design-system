// Provides a shared base tailwind config for all Teamshares apps
// Note: to load new changes in this file, the consuming app's asset pipeline may need to be restarted

// Load the JSON tokens from Shoelace; they are already structured in Tailwind config format
const tokens = require("@teamshares/shoelace/dist/styles/tokens.json");

// Inject the typography plugin config
tokens.typography = ({ theme }) => ({
  tsprose: {
    css: {
      "--tw-prose-body": theme("colors.gray[900]"),
      "--tw-prose-headings": theme("colors.gray[900]"),
      "--tw-prose-lead": theme("colors.gray[700]"),
      "--tw-prose-links": theme("colors.blue[700]"),
      "--tw-prose-bold": theme("colors.gray[900]"),
      "--tw-prose-counters": theme("colors.gray[600]"),
      "--tw-prose-bullets": theme("colors.gray[600]"),
      "--tw-prose-hr": theme("colors.gray[300]"),
      "--tw-prose-quotes": theme("colors.gray[900]"),
      "--tw-prose-quote-borders": theme("colors.gray[300]"),
      "--tw-prose-captions": theme("colors.gray[700]"),
      "--tw-prose-code": theme("colors.gray[900]"),
      "--tw-prose-pre-code": theme("colors.gray[100]"),
      "--tw-prose-pre-bg": theme("colors.gray[900]"),
      "--tw-prose-th-borders": theme("colors.gray[300]"),
      "--tw-prose-td-borders": theme("colors.gray[200]"),
      a: {
        color: theme("colors.blue[600]"),
        fontWeight: "400",
        textUnderlineOffset: "4px",
        transition: "all 300ms ease-in-out",
        "&:hover": {
          color: theme("colors.blue[700]"),
          textDecorationColor: "transparent",
        },
      },
    },
  },
});

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
