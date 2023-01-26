const tailwindDefaultConfig = require("./tailwind.config.js");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
console.log(`Preparing to bundle CSS in ${isProd ? "PRODUCTION" : "development mode"}`);

const injectSharedCodePaths = (config) => {
  // Scan any JS files from shared-ui (no known tailwind classes yet, but future proof)
  config.content.push("node_modules/@teamshares/ui/js/**.*.js");

  // Try to automatically scan shared-rails-engine... note THIS MEANS shared-rails-engine MUST ALREADY BE ON DISK
  // We need to figure out where the local teamshares_rails *ruby* gem is installed, despite being in a JS context
  try {
    const enginePath = require("child_process").execSync("bundle show teamshares_rails").toString().trim();
    if (enginePath.length) {
      config.content.push(`${enginePath}/**/*.{html,js,rb,erb,slim}`);
    }
  } catch (e) {
    console.warn("\n\nWARNING: Failed to detect the path to teamshares_rails -- build will NOT contain CSS for classes only referenced from shared code!!\n\n");
  }

  return config;
};

const defaultConfigTransformer = (config) => config;

const configBuilder = (tailwindConfigTransformer = defaultConfigTransformer) => {
  const baseConfig = injectSharedCodePaths(Object.assign({}, tailwindDefaultConfig));
  const tailwindConfig = tailwindConfigTransformer(baseConfig);

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

  return postcssConfig;
};

module.exports = { configBuilder };
