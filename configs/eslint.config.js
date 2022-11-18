const globals = require("globals");
const cypressPlugin = require("eslint-plugin-cypress");

// These three are required by eslint-plugin-standard (which we're manually recreating until it supports the flat file config)
const nPlugin = require("eslint-plugin-n");
const promisePlugin = require("eslint-plugin-promise");
// TODO: Kali -  this plugin doesn't yet support the flat config file... can uncomment the import/ rules in standardRules
// once this is resolved: https://github.com/import-js/eslint-plugin-import/issues/2556 (tried the fork, unsuccessful)
// const importPlugin = require("eslint-plugin-import");

const teamsharesGlobalCustomRules = {
  quotes: [2, "double"],
  semi: ["error", "always"],
  "comma-dangle": ["error", "always-multiline"],
  "no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
};

// TODO: Kali -- eslint wants us to use their new "flat-file" (eslint.config.js) config approach...
// ... which doesn't yet support the eslint-plugin-standard that we've previously depended on.
//
// That's coming as part of Phase 3: https://github.com/standard/eslint-config-standard/blob/master/.eslintrc.json
//
// But for now I've literally copy/pasted the v17.0.0 list of rules from https://github.com/standard/eslint-config-standard/blob/v17.0.0/.eslintrc.json

/* eslint-disable quote-props, object-curly-spacing, comma-dangle */
const standardRules = {
  "no-var": "warn",
  "object-shorthand": ["warn", "properties"],

  "accessor-pairs": ["error", { "setWithoutGet": true, "enforceForClassMembers": true }],
  "array-bracket-spacing": ["error", "never"],
  "array-callback-return": ["error", {
    "allowImplicit": false,
    "checkForEach": false
  }],
  "arrow-spacing": ["error", { "before": true, "after": true }],
  "block-spacing": ["error", "always"],
  "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
  "camelcase": ["error", {
    "allow": ["^UNSAFE_"],
    "properties": "never",
    "ignoreGlobals": true
  }],
  "comma-dangle": ["error", {
    "arrays": "never",
    "objects": "never",
    "imports": "never",
    "exports": "never",
    "functions": "never"
  }],
  "comma-spacing": ["error", { "before": false, "after": true }],
  "comma-style": ["error", "last"],
  "computed-property-spacing": ["error", "never", { "enforceForClassMembers": true }],
  "constructor-super": "error",
  "curly": ["error", "multi-line"],
  "default-case-last": "error",
  "dot-location": ["error", "property"],
  "dot-notation": ["error", { "allowKeywords": true }],
  "eol-last": "error",
  "eqeqeq": ["error", "always", { "null": "ignore" }],
  "func-call-spacing": ["error", "never"],
  "generator-star-spacing": ["error", { "before": true, "after": true }],
  "indent": ["error", 2, {
    "SwitchCase": 1,
    "VariableDeclarator": 1,
    "outerIIFEBody": 1,
    "MemberExpression": 1,
    "FunctionDeclaration": { "parameters": 1, "body": 1 },
    "FunctionExpression": { "parameters": 1, "body": 1 },
    "CallExpression": { "arguments": 1 },
    "ArrayExpression": 1,
    "ObjectExpression": 1,
    "ImportDeclaration": 1,
    "flatTernaryExpressions": false,
    "ignoreComments": false,
    "ignoredNodes": ["TemplateLiteral *", "JSXElement", "JSXElement > *", "JSXAttribute", "JSXIdentifier", "JSXNamespacedName", "JSXMemberExpression", "JSXSpreadAttribute", "JSXExpressionContainer", "JSXOpeningElement", "JSXClosingElement", "JSXFragment", "JSXOpeningFragment", "JSXClosingFragment", "JSXText", "JSXEmptyExpression", "JSXSpreadChild"],
    "offsetTernaryExpressions": true
  }],
  "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
  "keyword-spacing": ["error", { "before": true, "after": true }],
  "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
  "multiline-ternary": ["error", "always-multiline"],
  "new-cap": ["error", { "newIsCap": true, "capIsNew": false, "properties": true }],
  "new-parens": "error",
  "no-array-constructor": "error",
  "no-async-promise-executor": "error",
  "no-caller": "error",
  "no-case-declarations": "error",
  "no-class-assign": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": "error",
  "no-const-assign": "error",
  "no-constant-condition": ["error", { "checkLoops": false }],
  "no-control-regex": "error",
  "no-debugger": "error",
  "no-delete-var": "error",
  "no-dupe-args": "error",
  "no-dupe-class-members": "error",
  "no-dupe-keys": "error",
  "no-duplicate-case": "error",
  "no-useless-backreference": "error",
  "no-empty": ["error", { "allowEmptyCatch": true }],
  "no-empty-character-class": "error",
  "no-empty-pattern": "error",
  "no-eval": "error",
  "no-ex-assign": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-extra-boolean-cast": "error",
  "no-extra-parens": ["error", "functions"],
  "no-fallthrough": "error",
  "no-floating-decimal": "error",
  "no-func-assign": "error",
  "no-global-assign": "error",
  "no-implied-eval": "error",
  "no-import-assign": "error",
  "no-invalid-regexp": "error",
  "no-irregular-whitespace": "error",
  "no-iterator": "error",
  "no-labels": ["error", { "allowLoop": false, "allowSwitch": false }],
  "no-lone-blocks": "error",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  "no-prototype-builtins": "error",
  "no-useless-catch": "error",
  "no-mixed-operators": ["error", {
    "groups": [
      ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
      ["&&", "||"],
      ["in", "instanceof"]
    ],
    "allowSamePrecedence": true
  }],
  "no-mixed-spaces-and-tabs": "error",
  "no-multi-spaces": "error",
  "no-multi-str": "error",
  "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
  "no-new": "error",
  "no-new-func": "error",
  "no-new-object": "error",
  "no-new-symbol": "error",
  "no-new-wrappers": "error",
  "no-obj-calls": "error",
  "no-octal": "error",
  "no-octal-escape": "error",
  "no-proto": "error",
  "no-redeclare": ["error", { "builtinGlobals": false }],
  "no-regex-spaces": "error",
  "no-return-assign": ["error", "except-parens"],
  "no-self-assign": ["error", { "props": true }],
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  "no-tabs": "error",
  "no-template-curly-in-string": "error",
  "no-this-before-super": "error",
  "no-throw-literal": "error",
  "no-trailing-spaces": "error",
  "no-undef": "error",
  "no-undef-init": "error",
  "no-unexpected-multiline": "error",
  "no-unmodified-loop-condition": "error",
  "no-unneeded-ternary": ["error", { "defaultAssignment": false }],
  "no-unreachable": "error",
  "no-unreachable-loop": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-negation": "error",
  "no-unused-expressions": ["error", {
    "allowShortCircuit": true,
    "allowTernary": true,
    "allowTaggedTemplates": true
  }],
  "no-unused-vars": ["error", {
    "args": "none",
    "caughtErrors": "none",
    "ignoreRestSiblings": true,
    "vars": "all"
  }],
  "no-use-before-define": ["error", { "functions": false, "classes": false, "variables": false }],
  "no-useless-call": "error",
  "no-useless-computed-key": "error",
  "no-useless-constructor": "error",
  "no-useless-escape": "error",
  "no-useless-rename": "error",
  "no-useless-return": "error",
  "no-void": "error",
  "no-whitespace-before-property": "error",
  "no-with": "error",
  "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
  "object-curly-spacing": ["error", "always"],
  "object-property-newline": ["error", { "allowMultiplePropertiesPerLine": true }],
  "one-var": ["error", { "initialized": "never" }],
  "operator-linebreak": ["error", "after", { "overrides": { "?": "before", ":": "before", "|>": "before" } }],
  "padded-blocks": ["error", { "blocks": "never", "switches": "never", "classes": "never" }],
  "prefer-const": ["error", {"destructuring": "all"}],
  "prefer-promise-reject-errors": "error",
  "prefer-regex-literals": ["error", { "disallowRedundantWrapping": true }],
  "quote-props": ["error", "as-needed"],
  "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": false }],
  "rest-spread-spacing": ["error", "never"],
  "semi": ["error", "never"],
  "semi-spacing": ["error", { "before": false, "after": true }],
  "space-before-blocks": ["error", "always"],
  "space-before-function-paren": ["error", "always"],
  "space-in-parens": ["error", "never"],
  "space-infix-ops": "error",
  "space-unary-ops": ["error", { "words": true, "nonwords": false }],
  "spaced-comment": ["error", "always", {
    "line": { "markers": ["*package", "!", "/", ",", "="] },
    "block": { "balanced": true, "markers": ["*package", "!", ",", ":", "::", "flow-include"], "exceptions": ["*"] }
  }],
  "symbol-description": "error",
  "template-curly-spacing": ["error", "never"],
  "template-tag-spacing": ["error", "never"],
  "unicode-bom": ["error", "never"],
  "use-isnan": ["error", {
    "enforceForSwitchCase": true,
    "enforceForIndexOf": true
  }],
  "valid-typeof": ["error", { "requireStringLiterals": true }],
  "wrap-iife": ["error", "any", { "functionPrototypeMethods": true }],
  "yield-star-spacing": ["error", "both"],
  "yoda": ["error", "never"],

  // "import/export": "error",
  // "import/first": "error",
  // "import/no-absolute-path": ["error", { "esmodule": true, "commonjs": true, "amd": false }],
  // "import/no-duplicates": "error",
  // "import/no-named-default": "error",
  // "import/no-webpack-loader-syntax": "error",

  "n/handle-callback-err": ["error", "^(err|error)$"],
  "n/no-callback-literal": "error",
  "n/no-deprecated-api": "error",
  "n/no-exports-assign": "error",
  "n/no-new-require": "error",
  "n/no-path-concat": "error",
  "n/process-exit-as-throw": "error",

  "promise/param-names": "error",
};
/* eslint-enable quote-props, object-curly-spacing, comma-dangle */

// Low level helper to return configs set for different types of files
const buildConfigs = (customRules) => {
  const allRules = {
    ...standardRules,
    ...teamsharesGlobalCustomRules,
    ...customRules,
  };

  const coreConfig = {
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        // Note this is needed for esbuild to parse the "static targets" line of stimulus controllers...
        // *pretty* sure it doesn't mess wit the languageOptions ecmaVersion defined above (:fingers-crossed:)
        ecmaVersion: "latest",
      },
    },
    plugins: {
      // import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
    }, // These three were included by eslint-config-standard
    rules: allRules,
  };

  const browserConfig = { ...coreConfig };
  browserConfig.languageOptions = {
    ...browserConfig.languageOptions,
    globals: { ...globals.browser },
  };

  const nodeConfig = { ...coreConfig };
  nodeConfig.languageOptions = {
    ...nodeConfig.languageOptions,
    globals: { ...globals.node },
  };

  const cypressConfig = { ...nodeConfig };
  cypressConfig.plugins = { ...nodeConfig.plugins, cypress: cypressPlugin };
  cypressConfig.languageOptions = {
    ...cypressConfig.languageOptions,
    globals: {
      ...globals.node,

      // Manually pulled from: https://github.com/cypress-io/eslint-plugin-cypress/blob/master/index.js
      cy: false,
      Cypress: false,
      expect: false,
      assert: false,
      chai: false,

      // Just... seems necessary?
      it: false,
      describe: false,
      context: false,
      beforeEach: false,
    },
  };
  cypressConfig.rules = {
    ...cypressConfig.rules,

    // Manually pulled from: https://github.com/cypress-io/eslint-plugin-cypress#usage
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    // "cypress/no-force": "warn",  // Very verbose, and doesn't appear to be included in their cypress:recommended preset
    "cypress/no-async-tests": "error",
    "cypress/no-pause": "error",
  };

  return {
    coreConfig,
    nodeConfig,
    browserConfig,
    cypressConfig,
  };
};

// Higher level helper -- returns the full eslint config
const teamsharesDefaultRailsConfig = (customRules) => {
  const { browserConfig, nodeConfig, cypressConfig } = buildConfigs(customRules);

  return [
    "eslint:recommended",
    {
      ignores: [
        "coverage/**",
        "tmp/**",
        "app/assets/builds/**",
        "public/assets/**",
      ],
    },
    {
      files: ["*.config.js"],
      ...nodeConfig,
    },
    {
      files: ["cypress/**"],
      ...cypressConfig,
    },
    {
      files: ["app/javascript/**"],
      ignores: ["app/javascript/controllers/index.js"], // Autogenerated, don't bother parsing
      ...browserConfig,
    },
  ];
};

module.exports = {
  buildConfigs,
  teamsharesDefaultRailsConfig,
};
