const postcss = require('postcss');
const prefixComponentClasses = postcss.plugin('prefix-component-classes', () => {
    return (root, result) => {
      const matches = result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

      // Do not transform CSS files from outside of the components folder
      if (!matches) return;

      const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");

      root.walkRules(rule => {
        // console.log(`[${identifier}] ${rule.selector}`);
        // If the selector is our special `._base` rule, apply those styles directly to the generated class itself
        if (rule.selector == "._base") {
          rule.selector = `.c-${identifier}`;
        } else {
          rule.selector = `.c-${identifier} ${rule.selector}`;
        }
      });
    };
});

// NOTE: in *theory* the code below should switch to above plugin from v7 to v8...
// See migrations guide: https://evilmartians.com/chronicles/postcss-8-plugin-migration.

// Unfortunately, it starts throwing "CssSyntaxError: postcss-easy-import: <file>: Unknown word"
// errors for // comments

// const prefixComponentClasses = () => {
//     return {
//       postcssPlugin: "prefix-component-classes",
//       Once (root, result) {
//         const matches = result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

//         // Do not transform CSS files from outside of the components folder
//         if (!matches) return;

//         const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");

//         root.walkRules(rule => {
//           console.log(`[${identifier}] ${rule.selector}`);
//           rule.selector = `.c-${identifier} ${rule.selector}`;
//         });
//       },
//     };
// }
// prefixComponentClasses.postcss = true;

module.exports = prefixComponentClasses
