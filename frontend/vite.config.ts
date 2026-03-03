import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      'heatsphere-frontend.whitefield-dc96e279.brazilsouth.azurecontainerapps.io',
      'heatsphere.guilhermedoprado.com'
    ]
  }
});
