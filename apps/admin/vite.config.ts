import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@vendly/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@vendly/ui/globals.css": path.resolve(__dirname, "../../packages/ui/src/styles/globals.css"),
    },
  },
});
