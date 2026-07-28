import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Vadu-Maduwa-Carpentry-System/',
  server: {
    host: true,
    port: 5173
  }
})


