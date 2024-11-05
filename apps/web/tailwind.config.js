/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/ui/tailwind.config.js");

module.exports = {
  presets: [sharedConfig],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
