/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@kraft/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
