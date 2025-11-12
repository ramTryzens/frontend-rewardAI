import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // SECURITY: Strictly allow only these directories
      // This prevents access to backend files, .env, etc.
      allow: [
        path.resolve(__dirname, "./src"),
        path.resolve(__dirname, "./public"),
        path.resolve(__dirname, "./node_modules"),
      ],
      // Additional layer: Explicitly deny sensitive files
      deny: [
        "**/.env*",
        "**/server.js",
        "**/config/**",
        "**/models/**",
        "**/routes/**",
        "**/api/**",
        "**/*.md",
        "**/package.json",
        "**/vercel.json",
      ],
      // Strict mode: Don't follow symlinks outside allowed dirs
      strict: true,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Explicitly set the root to serve only frontend assets
  publicDir: "public",
  // Don't allow raw file serving
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp"],
}));
