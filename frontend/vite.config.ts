import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    watch: { usePolling: true },
    proxy: {
      '/api/notes':             { target: 'http://heatsphere_core_api:8080', changeOrigin: true },
      '/api/auth':              { target: 'http://heatsphere_core_api:8080', changeOrigin: true },
      '/api/productivity':      { target: 'http://heatsphere_core_api:8080', changeOrigin: true },
      '/api/heat-exchangers':   { target: 'http://heatsphere_math_service:8000', changeOrigin: true },
      '/api/external-flow':     { target: 'http://heatsphere_math_service:8000', changeOrigin: true },
    }
  }
});
