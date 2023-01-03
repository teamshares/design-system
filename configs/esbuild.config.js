// Note: more a build script than a config file, but keeping naming to match postcss.config.js
const path = require("path");
const { stimulusPlugin } = require("esbuild-plugin-stimulus");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";

const sharedConfig = {
  logLevel: "info",
  watch: process.argv.includes("--watch"),
  entryPoints: [
    "application.js",
  ],
  bundle: true,
  sourcemap: isProd,
  minify: isProd,
  target: "es2020", // NOTE: look into using browserlist here...
  outdir: path.join(process.cwd(), "app/assets/builds"),
  absWorkingDir: path.join(process.cwd(), "app/javascript"),
  publicPath: "/assets",
  assetNames: "[name]-[hash].digested",
  loader: {
    ".svg": "file",
  },
  define: {
    "process.env.HEROKU_APP_NAME": `"${process.env.HEROKU_APP_NAME || ""}"`,
    "process.env.RAILS_ENV": `"${process.env.RAILS_ENV || "development"}"`,
    "process.env.HONEYBADGER_JS_API_KEY": `"${process.env.HONEYBADGER_JS_API_KEY}"`,
    "process.env.HEROKU_RELEASE_VERSION": `"${process.env.HEROKU_RELEASE_VERSION}"`,
  },
  plugins: [
    stimulusPlugin(),
  ],
};

const builder = (config = sharedConfig) => require("esbuild")
  .build(config)
  .then(() => { console.log(`Build succeeded (${isProd ? "PRODUCTION" : "development mode"}).`); })
  .catch((e) => {
    console.log("Error building:", e.message);
    process.exit(1);
  });

module.exports = {
  sharedConfig, builder,
};
