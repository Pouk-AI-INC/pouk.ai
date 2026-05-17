// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";

export default defineConfig({
  site: "https://pouk.ai",

  integrations: [
    react(),
    sitemap(),
    // CSS is already minified by Vite's rollup pipeline (single-line, no whitespace).
    // The double-pass through astro-compress's csso/lightningcss chokes on the
    // already-minified Astro chunks and prints "Error: Cannot compress file …" to
    // stderr for every CSS file without actually breaking the build. Disable the
    // redundant pass; HTML/JS/Image compression still runs and is what we wanted
    // astro-compress for in the first place. (Backlog R18.)
    compress({ CSS: false }),
  ],

  build: {
    // Emit clean directory URLs: /why-ai/ → dist/why-ai/index.html
    format: "directory",
  },

  vite: {
    ssr: {
      // @poukai-inc/ui auto-injects component CSS via side-effect imports
      // (as of 0.2.2). Without noExternal, Node's native ESM loader sees the
      // .css imports during SSR and fails with "Unknown file extension '.css'".
      // Marking the package noExternal routes it through Vite's plugin chain,
      // where the CSS plugin extracts the styles into Astro's per-page bundle.
      noExternal: ["@poukai-inc/ui"],
    },
  },
});
