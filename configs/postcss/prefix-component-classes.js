const prefixComponentClasses = () => {
  return {
    postcssPlugin: "prefix-component-classes",
    Once (root, result) {
      const matches = result.result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

      // Do not transform CSS files from outside of the components folder
      if (!matches) return;

      const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");
      // console.log('================= prefixing component classes for', identifier);

      root.walkRules(rule => {
        // console.log(` ─╮ ${rule.selector}`);
        // If the selector is our special `._base` rule, apply those styles directly to the generated class itself
        if (rule.selector == "._base") {
          rule.selector = `.c-${identifier}`;
        } else {
          rule.selector = `.c-${identifier} ${rule.selector}`;
        }
        // console.log(`  ╰→${rule.selector}`);
      });
    },
  };
}
prefixComponentClasses.postcss = true;

module.exports = prefixComponentClasses;




