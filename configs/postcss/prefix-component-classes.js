const postcss = require('postcss');
const prefixComponentClasses = postcss.plugin('prefix-component-classes', () => {
    return (root, result) => {
      const matches = result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

      // Do not transform CSS files from outside of the components folder
      if (!matches) return;

      const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");

      root.walkRules(rule => {
        console.log(`[${identifier}] ${rule.selector}`);
        rule.selector = `.c-${identifier} ${rule.selector}`;
      });
    };
});

module.exports = prefixComponentClasses
