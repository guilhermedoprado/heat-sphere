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
      '/api/notes':             { target: 'http://localhost:5000', changeOrigin: true },
      '/api/productivity':      { target: 'http://localhost:5000', changeOrigin: true },
      '/api/heat-exchangers':   { target: 'http://localhost:8000', changeOrigin: true },
      '/api/external-flow':     { target: 'http://localhost:8000', changeOrigin: true },
    }
  }
});
