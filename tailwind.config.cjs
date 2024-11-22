/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Helvetica Neue", // A clean and modern professional font
          "Roboto",         // A widely used professional sans-serif
          "Arial",          // Classic and professional
          ...defaultTheme.fontFamily.sans,
        ]
        // sans: [
          // "Bricolage Grotesque Variable",
          // "Inter Variable",
          // "Inter",
        //   ...defaultTheme.fontFamily.sans,
        // ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
