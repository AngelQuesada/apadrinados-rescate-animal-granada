/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, "./src/components"),
      "#context": path.resolve(__dirname, "./src/context"),
      "#hooks": path.resolve(__dirname, "./src/hooks"),
      "#pages": path.resolve(__dirname, "./src/pages"),
      "#utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [ '**/node_modules/**', '**/dist/**', '**/build/**' ],
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.CI ? 'http://localhost:3002' : 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
