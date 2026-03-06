import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Quando o frontend roda DENTRO do Docker, usa o gateway. Quando roda LOCAL (npm run dev), usa localhost:8080.
const apiTarget = process.env.VITE_PROXY_TARGET || "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    watch: { usePolling: true },
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
    },
  },
});
