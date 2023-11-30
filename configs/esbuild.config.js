// Note: more a build script than a config file, but keeping naming to match postcss.config.js
const path = require("path");
const esbuild = require("esbuild");
const { stimulusPlugin } = require("esbuild-plugin-stimulus");
const { copy } = require("esbuild-plugin-copy");
const importGlobPlugin = require("esbuild-plugin-import-glob");

// const { getTeamsharesRailsPath } = require("../lib/teamshares-rails-path");
// const tsRailsPath = getTeamsharesRailsPath();

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
const isWatch = process.argv.includes("--watch");

// --- Start inlining esbuild-plugin-resolve ---
//
// Code from https://github.com/markwylde/esbuild-plugin-resolve/blob/master/index.js
// (working around module type mismatches preventing importing directly)
function intercept (build, moduleName, moduleTarget) {
  const filter = new RegExp("^" + moduleName.replace(/[\^$\\.*+?()[\]{}|]/g, "\\$&") + "(?:\\/.*)?$");

  build.onResolve({ filter, namespace: "file" }, async (args) => {
    const external = Boolean(build.initialOptions.external?.includes(args.path));

    if (external) {
      return { path: args.path, external };
    }

    if (args.resolveDir === "") {
      return;
    }

    return build.resolve(args.path.replace(moduleName, moduleTarget), { kind: args.kind, resolveDir: args.resolveDir });
  });
}

const EsbuildPluginResolve = (options) => ({
  name: "esbuild-resolve",
  setup: (build) => {
    for (const moduleName of Object.keys(options)) {
      intercept(build, moduleName, options[moduleName]);
    }
  },
});

// --- Finish inlining esbuild-plugin-resolve ---

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

    // HEROKU_SLUG_COMMIT isn't set until AFTER we finish building: https://stackoverflow.com/questions/43641049
    "process.env.HEROKU_SLUG_COMMIT": `"${process.env.SOURCE_VERSION || process.env.HEROKU_SLUG_COMMIT}"`,
  },
  plugins: [
    // EsbuildPluginResolve({
    //   "@teamshares-rails": path.join(tsRailsPath, "app/javascript/teamshares-rails"),
    // }),
    stimulusPlugin(),
    importGlobPlugin.default(),
    copy({
      // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
      // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
      resolveFrom: "cwd",
      assets: {
        from: ["./node_modules/@teamshares/shoelace/dist/assets/icons/*"],
        to: ["./public/assets/icons"],
      },
    }),
  ]
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
