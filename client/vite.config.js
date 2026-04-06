import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

const ip = process.env.VITE_APP_IP;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      // set this to the host IP (the address other clients will use)
      host: ip,
      protocol: "ws",
    },
  },
});
