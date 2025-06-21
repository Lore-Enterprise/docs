import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import mdx from "@mdx-js/rollup"
import generateSidebarJson from "./plugins/generate-sidebar-json"
import clearMetaMdx from "./plugins/clear-meta-mdx"
import UnoCSS from "unocss/vite"
import remarkGfm from "remark-gfm"

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
  base: mode === "production" ? "/docs" : "/",
  plugins: [
    clearMetaMdx(),
    generateSidebarJson(),
    mdx({
      remarkPlugins: [remarkGfm] // for generating tables https://remark.js.org/
    }),
    react(),
    UnoCSS()
  ],
  css: {
    devSourcemap: true
  }
}))
