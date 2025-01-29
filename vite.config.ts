import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/get-fraudulent-orders': 'http://localhost:8788',
      '/update-fraudulent-order-status': 'http://localhost:8788',
    }
  }
})
