/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@kraft/eslint-config/react.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignores: ["tailwind.config.js"],
};
