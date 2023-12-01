"use strict";

module.exports = {
  root: true,

  env: {
    node: true,
    es2022: true,
  },

  ignorePatterns: [".yarn/", "@types/", "output", "public", "!.*.*"],
  overrides: [
    {
      files: ["*.cjs"],
      extends: ["eslint:recommended"],
      parserOptions: {
        sourceType: "commonjs",
      },
      plugins: [],
    },
    {
      files: ["*.js", "*.mjs"],
      extends: ["eslint:recommended"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["*.cts", "*.mts", "*.ts"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
      ],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/array-type": ["error", { default: "generic" }],
        "@typescript-eslint/no-explicit-any": [
          "error",
          {
            ignoreRestArgs: true,
          },
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  rules: {
    "consistent-return": "error",
    eqeqeq: "error",
    "no-console": "off",
    "no-else-return": "error",
    "no-unused-expressions": "warn",
    "no-use-before-define": "error",
    "prefer-const": "error",
    quotes: "warn",
    strict: ["error", "global"],
  },
};
