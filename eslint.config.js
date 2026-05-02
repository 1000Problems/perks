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
      // TypeScript already validates references against declared types
      // (DOM lib, @types/node, @types/react). The eslint no-undef rule
      // would need a populated `globals` config to know that FormData,
      // Buffer, console, React, setTimeout, etc. exist — disabling it
      // is the typescript-eslint-recommended path. tsc --noEmit catches
      // any real undefined reference.
      "no-undef": "off",
      // Ignore intentionally-unused names by convention (leading _).
      // Matches what's already in lib/rules/evaluate.ts (_ctx) and
      // saves us from having to silence one-off cases inline.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
