import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import basicSsl from "@vitejs/plugin-basic-ssl";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import react from '@astrojs/react';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.jayalakshmiinteriors.com',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      priority: 0.85,
      serialize: (item) => {
        if (item.url.at(-1) === '/') {
          item.url = item.url.slice(0, -1);
        }
        return item;
      }
    }),
    mdx(),
    icon(),
    react()],
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
    optimizeDeps: { exclude: ["fsevents"] },
  },
});
