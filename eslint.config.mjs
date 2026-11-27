import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "cypress/reports/",
      "cypress/screenshots/",
      "cypress/videos/",
      "cypress/downloads/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
