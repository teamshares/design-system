module.exports = {
  extends: "stylelint-config-sass-guidelines",
  rules: {
    "length-zero-no-unit": [true, {
      ignore: ["custom-properties"],
    }],
    "max-nesting-depth": 4,
    "selector-max-compound-selectors": 4,
    "selector-max-id": 1,
    "selector-class-pattern": null,
    "selector-no-qualifying-type": [true, {
      ignore: ["class", "attribute"],
    }],
  },
};
