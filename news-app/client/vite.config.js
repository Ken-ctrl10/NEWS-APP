// client/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // lock dev port for teammates
    strictPort: true,    // fail if 5173 is in use (so people notice)
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Express backend
        changeOrigin: true
        // secure: false, // only needed if your target is HTTPS with self-signed cert
      },
    },
  },
});