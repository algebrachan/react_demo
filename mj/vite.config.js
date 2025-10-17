import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "src"), // 将 `@` 映射到 `src` 目录
    },
  },
  server: {
    port: 3006,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    port: 8000,
  }
})
