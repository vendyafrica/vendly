import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// @ts-ignore
import sharedConfig from '@vendly/ui/postcss.config'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
  },
  css: {
    postcss: sharedConfig,
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})