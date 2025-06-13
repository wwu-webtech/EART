import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  // Make all Astro URLs relative
  base: "./",

  // Default build behavior: put your CSS+JS next to index.html
  build: {
    assetsDir: ".",
  },

  vite: {
    // Tell Vite itself to emit everything relative to the page
    base: "./",
    plugins: [tailwindcss()],
    build: {
      assetsDir: ".",
      rollupOptions: {
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name][extname]",
        },
      },
    },
  },

  integrations: [react()],
});
