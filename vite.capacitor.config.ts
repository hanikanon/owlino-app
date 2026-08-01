// Standalone Vite config used ONLY for the native (Capacitor) build.
// Deliberately does NOT import @lovable.dev/vite-tanstack-config: that
// wrapper forces a Cloudflare Workers (SSR, no static HTML) build target
// which Capacitor cannot bundle. This config produces a plain client-side
// (CSR) static build instead — real index.html + JS/CSS bundle.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  publicDir: "public",
  build: {
    outDir: "dist-capacitor",
    emptyOutDir: true,
  },
});
