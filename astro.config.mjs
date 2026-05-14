// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";

export default defineConfig({
  site: "https://pouk.ai",

  integrations: [
    react(),
    sitemap({
      // Register the static index.html route alongside the Astro routes
      customPages: ["https://pouk.ai/"],
    }),
    compress(),
  ],

  build: {
    // Emit clean directory URLs: /why-ai/ → dist/why-ai/index.html
    format: "directory",
  },
});
