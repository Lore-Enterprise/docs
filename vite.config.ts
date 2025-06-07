import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import mdx from "@mdx-js/rollup"
import generateSidebarJson from "./plugins/generate-sidebar-json"
import clearMetaMdx from "./plugins/clear-meta-mdx"
import UnoCSS from "unocss/vite"

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
  base: mode === "production" ? "/docs" : "/",
  plugins: [
    clearMetaMdx(),
    generateSidebarJson(),
    mdx(),
    react(),
    UnoCSS()
  ],
  css: {
    devSourcemap: true
  }
}))
