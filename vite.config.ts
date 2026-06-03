/// <reference types="vitest/config" />
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/lib/test-utils.ts",
    coverage: {
      exclude: [
        "**/components/ui/**",
        "*.css",
        "**/i18n/",
        "src/api/",
        "src/lib/",
        "use-mobile.ts",
      ],
    },
  },
  build: {
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { test: /node_modules\/(react|react-dom|react-router)/, name: "react" },
            { test: /node_modules\/@tanstack\/react-query/, name: "tanstack-query" },
            { test: /node_modules\/(firebase\/auth|firebase\/app)/, name: "firebase" },
            { test: /node_modules\/zod/, name: "zod" },
          ],
        },
      },
    },
  },
});
