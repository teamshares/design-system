var clc = require("cli-color");

const prefixComponentClasses = () => {
  return {
    postcssPlugin: "prefix-component-classes",
    Once (root, result) {
      const matches = result.result.opts.from.match(/frontend\/components\/?(.*)\/[^/]+?.s?css$/);

      // Do not transform CSS files from outside of the components folder
      if (!matches) return;

      const filePath = matches[0].replace('frontend/components/', '');
      const identifier = matches[1].replaceAll("/", "--").replaceAll("_", "-");
      console.log('================= prefixing component classes for', clc.yellow(filePath));
      let hasWrapperClass = false;
      root.walkRules(rule => {
        // console.log(`Rule: ${rule}`);
        /**
         * If the selector is our special `._component` rule, that's the designated wrapper.
         * All encapsulated component classes are expected to be nested within that.
         **/ 
        if (rule.selector == "._component") {
          console.log(clc.green(`  Replacing ._component block with .${identifier}`));
          hasWrapperClass = true;
          rule.selector = `.c-${identifier}`;
        }
      });
      if (!hasWrapperClass) {
        console.log(clc.red(`  No '._component {}' block in ${filePath}. Classes will not be encapsulated.`))
      }
    },
  };
}
prefixComponentClasses.postcss = true;

module.exports = prefixComponentClasses;




