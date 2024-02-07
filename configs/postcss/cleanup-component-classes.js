/** 
 * This PosCSS plugin cleans up after the cases in which Tailwind's nesting 
 * incorrectly doubles our generated component classes.
 * See the test code below for examples.
 */
function cleanupSelector(selector) {
  // Match anything in the selector with the pattern `.c-foo--bar-qux--baz`
  let pattern = selector.match(/\.c-[^ .]*--[^ .]*/);
  if (pattern) {
    let before = selector.toString();
    let firstIndex = selector.indexOf(pattern);
    // Create a regex object from the above matched pattern, e.g. `/\.c\-foo\-\-bar\-qux\-\-baz/g`
    let regex = new RegExp(pattern[0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "g");
    // Keep only the first instance of that pattern in the selector
    let after = selector.replace(regex, (match, index) => index === firstIndex ? match : "");
    selector = after.split(' ').filter(Boolean).join(' ');
    if (selector !== before) {
      console.log(` ─╮ ${before}`);
      console.log(`  ╰→${selector}`);
    }
  }
  return selector;
}

/** Test code for the method above */
/**
// How it starts after Tailwind has had its way with application.css
const input = [
  ".c-shared-ui--navigation--app-switcher",
  ".c-shared-ui--navigation--app-switcher .c-shared-ui--navigation--app-switcher .app-switcher-nav-items .c-shared-ui--navigation--app-switcher a:hover",
  ".c-shared-ui--demo",
  ".c-shared-ui--navigation--app-switcher .c-shared-ui--navigation--app-switcher .app-switcher-nav-items .c-shared-ui--navigation--app-switcher a:hover .c-shared-ui--navigation--app-switcher .app-icon",
  ".c-foo--bar-qux--baz",
  ".ts-drawer.c-foo--bar-qux--baz .c-foo--bar-qux--baz sl-card::part(base) .ts-drawer__links a",
  ".c-foo--bar-qux--baz sl-card .c-foo--bar-qux--baz sl-icon-button"
];
// How it was supposed to look
const output = [
  ".c-shared-ui--navigation--app-switcher",
  ".c-shared-ui--navigation--app-switcher .app-switcher-nav-items a:hover",
  ".c-shared-ui--demo",
  ".c-shared-ui--navigation--app-switcher .app-switcher-nav-items a:hover .app-icon",
  ".c-foo--bar-qux--baz",
  ".ts-drawer.c-foo--bar-qux--baz sl-card::part(base) .ts-drawer__links a"
  ".c-foo--bar-qux--baz sl-card sl-icon-button"
];
function simplifySelectors(inputArray) {
  return inputArray.map(cleanupSelector);
}
// This should be equal to output above
console.log(simplifySelectors(input));
*/

const cleanupComponentClasses = () => {
  return {
    postcssPlugin: "cleanup-component-classes",
    Once (root, result) {
      root.walkRules(rule => {
        rule.selector = cleanupSelector(rule.selector);
      });
    },
  };
}
cleanupComponentClasses.postcss = true;

module.exports = cleanupComponentClasses;