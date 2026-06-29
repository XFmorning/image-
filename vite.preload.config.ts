import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: ".vite/build",
    lib: {
      entry: "src/preload.ts",
      fileName: "preload",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron"],
    },
  },
});
