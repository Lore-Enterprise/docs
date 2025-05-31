import { Plugin } from "vite"
import matter from "gray-matter"

export default function clearMetaMdx(): Plugin {
  return {
    name: "clear-meta-mdx",
    enforce: "pre",
    transform(code, id) { // Vite calls transform for each imported file
      if (id.endsWith(".md") || id.endsWith(".mdx")) {
        const { content } = matter(code)
        return {
          code: content,
          map: null,
        }
      }
      return null
    },
  }
}