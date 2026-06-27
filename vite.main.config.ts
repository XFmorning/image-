import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: ".vite/build",
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "electron",
        "electron-squirrel-startup",
        "path",
        "fs",
        "fs/promises",
        "os",
      ],
    },
  },
  resolve: {
    browserField: false,
    conditions: ["node"],
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
