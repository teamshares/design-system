var clc = require("cli-color");
const DEBUG = process.env.LOG_CSS === "debug";
const INFO = DEBUG || process.env.LOG_CSS === "info";


const prefixComponentClasses = () => {
  return {
    postcssPlugin: "prefix-component-classes",
    Once (root, result) {
      const matches = result.result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

      // Do not transform CSS files from outside of the components folder
      if (!matches) return;

      const filePath = matches[0].replace("frontend/components/", "");
      const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");
      const info = INFO && identifier === "sidecar-styles-demo"
      const debug = DEBUG && identifier === "sidecar-styles-demo"
      if (info) console.log("================= Prefixing component classes for", clc.cyan(filePath));

      root.walkRules(rule => {
        // If the selector is our special `._base` rule, apply those styles directly to the generated class itself
        if (rule.selector == "._base") {
          if (debug) console.log(`\tReplacing ${rule.selector} with .c-${identifier}`);
          rule.selector = `.c-${identifier}`;
        } else if (rule.selector.startsWith("._component")) {
          if (info) console.log(rule.selector)
          const new_selector = `.c-${identifier}${rule.selector.replace("._component", "")}`;
          if (info) console.log(clc.yellow("\tIgnoring old-style '._component' wrapper:"), `replacing ${rule.selector} with ${new_selector}`);
          rule.selector = new_selector;
        } else {
          if (debug) console.log(`\tPrefixing ${rule.selector} with .c-${identifier}`);
          rule.selector = `.c-${identifier} ${rule.selector}`;
        }
      });
    },
  };
}
prefixComponentClasses.postcss = true;

module.exports = prefixComponentClasses;




