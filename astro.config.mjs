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
  site: import.meta.env.PUBLIC_URL,
  integrations: [tailwind(), mdx(), sitemap(), icon(),react()],
  output: "server",
  adapter: vercel({
    // imageService: true,
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
    optimizeDeps: { exclude: ["fsevents"] },
  },
});
