import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the build works from any path (root, GitHub Pages subpath, static host).
  base: "./",
  plugins: [react()],
});
