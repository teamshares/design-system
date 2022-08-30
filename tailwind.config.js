/*
 * To load new changes in this file,
 * the Webpack server needs to be restarted.
 * TODO: Support webpack-dev-server livereload (or the equivalent in Rails 7+)
 *
 */

module.exports = {
  content: [
    './app/views/**/*',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/components/**/*',
    './public/*.html'
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#F6FAFD',
          100: "#e1eff9",
          200: "#b7d8f0",
          300: "#84bafa",
          400: "#539ef8",
          500: "#3b74fc",
          600: "#2c5ed6",
          700: "#3a5dae",
          800: "#29427b",
          900: "#353d5f",
          1000: "#2f3654"
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
          900: "#2e333c"
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
          900: "#9b2614"
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
          900: "#004d49"
        },
        yellow: {
          50: '#FFFBF0',
          100: "#faf4ea",
          200: "#f2eade",
          300: "#fce491",
          400: "#fad860",
          500: "#ffc328",
          600: "#f6af47",
          700: "#ca861e",
          800: "#956419",
          900: "#694712"
        },
        subdued: "#6d7176",
        default: "#2e333c",
        white: "#ffffff",
        success: "#068466",
        error: "#d7351c"
      },
      fontFamily: {
        sans: "Inter, Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        serif: "DM Serif Display, Georgia, Times, serif",
        mono: "SFMono-Regular, Menlo, mono",
        display: "DM Serif Display, Georgia, Times, serif",
        body: "Inter, Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      },
      fontSize: {
        "10px": ["0.625rem", "1.5em"],
        "13px": ["0.8125rem", "1.5em"]
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      // TODO: delete height and width configs after updating Tailwind > 2.1
      height: {
        "680px": "680px",
        "38": "38rem"
      },
      width: {
        "300px": "300px",
        "350px": "350px",
        "400px": "400px",
        "450px": "450px",
        "500px": "500px",
        "550px": "550px",
        "600px": "600px",
        "650px": "650px",
        "700px": "700px",
        "750px": "750px",
        "800px": "800px",
        "850px": "850px",
        "900px": "900px",
        "950px": "950px",
        "1000px": "1000px",
       },
      margin: {
        "54px": "54px"
      },
      spacing: {
        15: "3.75rem"
      },
      // Not in Buyout
      transitionProperty: {
        height: "height",
      },
      gridTemplateRows: {
        "7": "repeat(8, minmax(0, 1fr))",
        "12": "repeat(12, minmax(0, 1fr))",
      },
      inset: {
        '-16': '-4rem'
      },
      opacity: {
        '95': '0.95'
      },
      screens: {
        'container-md': [
          // Sidebar appears at 768px, so revert to `sm:` styles
          // between 768px and 868px, after which the main
          // content area is wide enough again to apply the
          // `md:` styles.
          {
            'min': '641px',
            'max': '767px'
          },
          {
            'min': '868px'
          }
        ],
      },
    }
  },
  variants: {
    extend: {
      backgroundColor: ["active", "odd"],
      borderColor: ["active"],
      borderStyle: ["group-hover", "hover", "focus", "active"],
      borderWidth: ["first", "last"],
      fill: ["hover", "focus"],
      padding: ["first", "last"],
      ringColor: ["focus-visible"],
      ringWidth: ["focus-visible"],
      textColor: ["active"],
      visibility: ["group-hover", "hover"]
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp")
  ],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  },
  experimental: {
    applyComplexClasses: true
  },
  darkMode: "class"
};
