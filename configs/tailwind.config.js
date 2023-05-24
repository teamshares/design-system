// Provides a shared base tailwind config for all Teamshares apps
// Note: to load new changes in this file, the consuming app's asset pipeline may need to be restarted

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
    extend: {
      colors: {
        current: "currentColor",
        blue: {
          50: "#F6FAFD",
          100: "#e1eff9",
          200: "#b7d8f0",
          300: "#84bafa",
          400: "#539ef8",
          500: "#3b74fc",
          600: "#2c5ed6",
          700: "#3a5dae",
          800: "#29427b",
          900: "#353d5f",
          1000: "#2f3654",
        },
        gray: {
          100: "#f6f8fa",
          200: "#f0f0f0",
          300: "#e8e8e8",
          400: "#cdcfd1",
          500: "#b3b5b8",
          600: "#93999e",
          700: "#6d7176",
          800: "#444c59",
          900: "#2e333c",
        },
        red: {
          100: "#fcf1ef",
          200: "#f7d7d2",
          300: "#eec9c1",
          400: "#f0948b",
          500: "#f65747",
          600: "#d64e41",
          700: "#d7351c",
          800: "#b92e18",
          900: "#9b2614",
        },
        green: {
          100: "#eef6e8",
          200: "#d4e8c3",
          300: "#72d0a3",
          400: "#21bc9c",
          500: "#17a688",
          600: "#10985f",
          700: "#068466",
          800: "#164e3e",
          900: "#004d49",
        },
        yellow: {
          50: "#FFFBF0",
          100: "#faf4ea",
          200: "#f2eade",
          300: "#fce491",
          400: "#fad860",
          500: "#ffc328",
          600: "#f6af47",
          700: "#ca861e",
          800: "#956419",
          900: "#694712",
        },
        teal: {
          100: "#F0FAFA",
          200: "#CAEBEC",
          300: "#A4DBDD",
          400: "#80CBCE",
          500: "#5CBABD",
          600: "#39A8AC",
          700: "#288286",
          800: "#1A5B5D",
          900: "#0D3233",
        },
        subdued: "#6d7176",
        default: "#2e333c",
        white: "#ffffff",
        success: "#068466",
        error: "#d7351c",
      },
      fontFamily: {
        sans: "Inter, Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        serif: "DM Serif Display, Georgia, Times, serif",
        mono: "SFMono-Regular, Menlo, mono",
        display: "DM Serif Display, Georgia, Times, serif",
        body: "Inter, Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
      fontSize: {
        "10px": ["0.625rem", "1.5em"],
        "13px": ["0.8125rem", "1.5em"],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      spacing: {
        15: "3.75rem",
      },
      // Not in Buyout
      transitionProperty: {
        height: "height",
      },
    },
  },
};

module.exports = tailwindConfig;
