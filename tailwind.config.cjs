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
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
      animation: {
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
