import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Permitir el acceso a través de túneles (localtunnel / Cloudflare Tunnel)
    allowedHosts: ['.loca.lt', '.trycloudflare.com'],
  },
})
