import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          process.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5001", // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
