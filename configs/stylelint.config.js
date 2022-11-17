module.exports = {
  extends: "stylelint-config-sass-guidelines",
  rules: {
    "max-nesting-depth": 4,
    "selector-max-compound-selectors": 4,
    "selector-max-id": 1,
    "selector-class-pattern": null,
    "selector-no-qualifying-type": [true, {
      ignore: ["class", "attribute"]
    }],
    "scss/at-rule-no-unknown": [null, {
      ignoreAtRules: ["responsive"]
    }]
  }
};
