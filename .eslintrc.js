"use strict";

/**
 * Based on npm coding standards at https://docs.npmjs.com/misc/coding-style.
 *
 * The places we differ from the npm coding style:
 *   - Commas should be at the end of a line.
 *   - Always use semicolons.
 *   - Functions should not have whitespace before params.
 */

module.exports = {
  "env": {
    "node": true
  },
  parserOptions: {
    ecmaVersion: 6,
  },
  "rules": {
    "brace-style": ["error", "1tbs"],
    "camelcase": "error",
    "comma-dangle": ["error", "never"],
    "comma-spacing": "error",
    "comma-style": ["error", "last"],
    "curly": ["error", "multi-line"],
    "handle-callback-err": ["error", "er"],
    "indent": ["error", 2, {"SwitchCase": 1}],
    "max-len": ["error", 80],
    "no-multiple-empty-lines": ["error", {"max": 1}],
    "no-undef": "error",
    "no-undef-init": "error",
    "no-unexpected-multiline": "error",
    "object-curly-spacing": "off",
    "one-var": ["error", "never"],
    "operator-linebreak": ["error", "after"],
    "semi": ["error", "always"],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", "never"],
    "keyword-spacing": "error",
    "strict": ["error", "global"],

    // more from hildjj:
    "quotes": ["error", "single"],
  },
};
