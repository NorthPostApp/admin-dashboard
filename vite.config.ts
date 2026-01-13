/// <reference types="vitest/config" />
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: process.env.VITEST ? [] : ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
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
      exclude: ["**/components/ui/**", "*.css", "**/i18n/", "src/api/", "src/lib/"],
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-form": ["@tanstack/react-form", "@tanstack/react-query"],
          "vendor-i18n": ["i18next", "react-i18next", "i18next-resources-to-backend"],
          "vendor-firebase": ["firebase/auth", "firebase/app"],
          zod: ["zod"],
        },
      },
    },
  },
});
