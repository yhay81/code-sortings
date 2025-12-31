const js = require("@eslint/js");
const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const tsEslintParser = require("@typescript-eslint/parser");
const eslintConfigPrettier = require("eslint-config-prettier");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "dev-server.js",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.es2015,
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsEslintPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.strict.rules,
      ...eslintConfigPrettier.rules,
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];
