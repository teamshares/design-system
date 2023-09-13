// Unfortunately can't use our own require-shared-config, since we don't use rubygems anymore.
// Manually copied over the settings required to pass linting as of September 2023, Design System team can adjust as needed.

module.exports = {
  extends: "stylelint-config-sass-guidelines",
  rules: {
    // Without this exception, stylelint will incorrectly append "px" to any "0" value, which can break calc() functions
    "length-zero-no-unit": [true, {
      ignore: ["custom-properties"],
    }],
    "max-nesting-depth": 4,
    "selector-class-pattern": null,
    "selector-no-qualifying-type": [true, {
      ignore: ["class", "attribute"],
    }],
  },
};
