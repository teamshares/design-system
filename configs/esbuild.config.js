// Note: more a build script than a config file, but keeping naming to match postcss.config.js
const path = require("path");
const esbuild = require("esbuild");
const { stimulusPlugin } = require("esbuild-plugin-stimulus");
const { copy } = require("esbuild-plugin-copy");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
const isWatch = process.argv.includes("--watch");

const sharedConfig = {
  logLevel: "warning",
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
    copy({
      // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
      // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
      resolveFrom: "cwd",
      assets: {
        from: ["./node_modules/@teamshares/shoelace/dist/assets/icons/*"],
        to: ["./public/assets/icons"],
      },
    },
    ),
  ],
};

const defaultConfigTransformer = (config) => config;

const builder = async (configTransformer = defaultConfigTransformer) => {
  console.log(`Preparing to ${isWatch ? "watch" : "build"} (${isProd ? "PRODUCTION" : "development mode"})...`);
  const config = configTransformer(sharedConfig);
  const ctx = await esbuild.context(config);

  if (isWatch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
};

module.exports = {
  builder,
};
