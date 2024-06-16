import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  prettierConfig,
  {
    ignores: [
      ".yarn/",
      ".git/",
      "coverage/",
      "docs/",
      "node_modules/",
      "output/",
      "public/",
      "*.config.*",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      parserOptions: {
        sourceType: "commonjs",
      },
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.cts", "**/*.mts", "**/*.ts"],
    extends: tseslint.configs.strictTypeChecked,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        EXPERIMENTAL_useProjectService: true,
      },
    },
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
  {
    rules: {
      "consistent-return": "error",
      "no-else-return": "error",
      "no-unused-expressions": "warn",
      "no-use-before-define": "error",
      eqeqeq: "error",
      strict: ["error", "global"],
    },
  },
);
