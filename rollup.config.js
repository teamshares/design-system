import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import pkg from "./package.json";


const plugins = [
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**"
  }),
  nodeResolve()
];

const external = ["stimulus"];

export default [
  {
    input: "src/index.js",
    external,
    plugins,
    output: {
      globals: { stimulus: "Stimulus" },
      file: pkg.main,
      format: "umd",
      name: "TeamsharesUI"
    }
  },
  {
    input: "src/index.js",
    plugins,
    external,
    output: {
      file: pkg.module,
      format: "es",
    },
  }
];
