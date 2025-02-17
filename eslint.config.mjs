import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    ignores: ["dist/**"],
    ...pluginJs.configs.recommended,
    ...eslintConfigPrettier,
  },
];
