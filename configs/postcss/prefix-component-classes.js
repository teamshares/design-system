var clc = require("cli-color");

const isProd = process.env.RAILS_ENV === "production" || process.env.NODE_ENV === "production";
const LOG_LEVEL = process.env.CSS_LOG || (isProd ? "warn" : "info");

const logger = {
  debug: (...msgs) => { if (LOG_LEVEL == "debug") console.log(...msgs); },
  info: (...msgs) => { if (LOG_LEVEL == "debug" || LOG_LEVEL == "info") console.log(...msgs); },
  warn: (...msgs) => { console.log(...msgs); },
}

const tracker = { numRules: 0 };

const parseRule = (wrapper) => (rule) => {
  tracker.numRules++;

  if (rule.selector == "._base") {
    // If the selector is our special `._base` rule, apply those styles directly to the generated class itself
    logger.debug(`\tReplacing ${clc.whiteBright(rule.selector)} with ${clc.whiteBright(wrapper)}`);
    rule.selector = wrapper;
  } else if (rule.selector.startsWith("._base")) {
    // We do not support nesting anything under ._base (just make it a top-level rule and it'll be auto-nested)
    logger.warn(clc.red("\tDROPPING SELECTOR:", clc.redBright(rule.selector), clc.red("(do not nest anything under ._base)")));
    rule.remove();
  } else if (rule.selector.startsWith("._component")) {
    // DEPRECATED: ideally we'd remove all ._component selectors, but for now we'll just strip the wrapper
    // TODO: we don't support rules with commas here, so remove this once confirmed removed from all components
    const new_selector = `${wrapper}${rule.selector.replace("._component", "")}`;
    logger.info(clc.yellow(`\tIgnoring deprecated ._component wrapper on ${clc.yellowBright(rule.selector)}`));
    rule.selector = new_selector;
  } else {
    if (!rule.selector.includes(",")) {
      // Default case: prefix the selector with the component class
      logger.debug(clc.white(`\tPrefixing ${clc.whiteBright(rule.selector)}`));
      rule.selector = `${wrapper} ${rule.selector}`;
    } else {
      // Default case, but a bit more complex -- we need to explode the selector into multiple rules
      rule.selector.split(",").forEach((selector, i) => {
        logger.debug(clc.white(`\tPrefixing ${clc.whiteBright(rule.selector)}: ${clc.yellowBright(selector.trim())}`));
        const newRule = rule.clone();
        newRule.selector = `${wrapper} ${selector.trim()}`;
        rule.before(newRule)
      });
      rule.remove();
    }
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

      logger.info("================= Prefixing selectors in component", clc.cyanBright(filePath), "with", clc.cyan(wrapper));
      tracker.numRules = 0;
      root.walkRules(parseRule(wrapper));
      logger.debug(`\tProcessed ${tracker.numRules} rules`);
    },
  };
}
prefixComponentClasses.postcss = true;

module.exports = prefixComponentClasses;
