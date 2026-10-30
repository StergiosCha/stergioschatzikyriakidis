import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages deployment - repo name: stergioschatzikyriakidis
  base: '/',
  plugins: [inspectAttr(), react()],
  // INLINE_FOR_TEST=1 bundles lazy chunks into one file so a jsdom smoke test can eval it (production builds are unaffected).
  build: process.env.INLINE_FOR_TEST ? { outDir: process.env.INLINE_OUT || 'dist-test', rollupOptions: { output: { inlineDynamicImports: true } } } : {},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
