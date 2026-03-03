import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Isso garante que ele rode no 0.0.0.0
    port: 5173,
    strictPort: true,
    allowedHosts: true, // Isso desativa a trava de segurança do Vite 6
    watch: {
      usePolling: true,
    }
  }
});
