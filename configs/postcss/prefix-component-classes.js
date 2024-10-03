var clc = require("cli-color");
const DEBUG = process.env.LOG_CSS === "debug";
const INFO = DEBUG || process.env.LOG_CSS === "info";

const parseRule = (wrapper) => (rule) => {
  if (rule.selector == "._base") {
    // If the selector is our special `._base` rule, apply those styles directly to the generated class itself
    if (DEBUG) console.log(`\tReplacing ${clc.whiteBright(rule.selector)} with ${clc.whiteBright(wrapper)}`);
    rule.selector = wrapper;
  } else if (rule.selector.startsWith("._base")) {
    // We do not support nesting anything under ._base (just make it a top-level rule and it'll be auto-nested)
    console.log(clc.red("\tDROPPING SELECTOR:", clc.redBright(rule.selector), clc.red("(do not nest anything under ._base)")));
    rule.remove();
  } else if (rule.selector.startsWith("._component")) {
    // DEPRECATED: ideally we'd remove all ._component selectors, but for now we'll just strip the wrapper
    const new_selector = `${wrapper}${rule.selector.replace("._component", "")}`;
    if (INFO) console.log(clc.yellow(`\tRemoving old-style ._component wrapper from ${clc.yellowBright(rule.selector)}`));
    rule.selector = new_selector;
  } else {
    // Default case: prefix the selector with the component class
    if (DEBUG) console.log(clc.white(`\tPrefixing ${clc.whiteBright(rule.selector)}`));
    rule.selector = `${wrapper} ${rule.selector}`;
  }
};

const prefixComponentClasses = () => {
  return {
    postcssPlugin: "prefix-component-classes",
    Once (root, result) {
      const matches = result.result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

      // Do not transform CSS files from outside of the components folder
      if (!matches) return;

      const filePath = matches[0].replace("frontend/components/", "");
      const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");
      const wrapper = `.c-${identifier}`;

      if (INFO) console.log("================= Prefixing selectors in component", clc.cyanBright(filePath), "with", clc.cyan(wrapper));
      root.walkRules(parseRule(wrapper));
    },
  };
}
prefixComponentClasses.postcss = true;

module.exports = prefixComponentClasses;




