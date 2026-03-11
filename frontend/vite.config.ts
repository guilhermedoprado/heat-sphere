import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// LOCAL (dotnet run): backend na 5100. DOCKER: gateway na 8080 — use VITE_PROXY_TARGET=http://localhost:8080
const apiTarget = process.env.VITE_PROXY_TARGET || "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-katex": "/src/lib/reactKatexSafe.tsx",
    },
  },
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
