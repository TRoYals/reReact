import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default {
  parser: "@typescript-eslint/parser",
  extends: [pluginJs.configs.recommended, ...tseslint.configs.recommended],
  env: {
    browser: true,
  },
};
