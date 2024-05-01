module.exports = {
  extends: "stylelint-config-sass-guidelines",
  rules: {
    // Without this exception, stylelint will incorrectly append "px" to any "0" value, which can break calc() functions
    "length-zero-no-unit": [true, {
      ignore: ["custom-properties"],
    }],
    "max-nesting-depth": 4,
    "selector-max-compound-selectors": 5, // Adding one to account for auto-wrapping in view components
    "selector-max-id": 1,
    "selector-class-pattern": null,
    "selector-no-qualifying-type": [true, {
      ignore: ["class", "attribute"],
    }],
    "scss/at-rule-no-unknown": [true, {
      ignoreAtRules: ["define-mixin"]
    }],
  },
};
