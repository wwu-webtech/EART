import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  base: "./",

  build: {
    assetsDir: ".",
  },

  vite: {
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
