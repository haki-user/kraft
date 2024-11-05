/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@kraft/eslint-config/server.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
