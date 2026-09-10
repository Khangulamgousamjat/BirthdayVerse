import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    "dist/**",
    "build/**",
    "node_modules/**",
    ".next/**",
    "out/**",
  ]),
]);

export default eslintConfig;
