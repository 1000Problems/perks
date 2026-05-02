const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const nextPlugin = require("@next/eslint-plugin-next");

module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [".next/**", "node_modules/**", ".next2/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
    },
  },
];
