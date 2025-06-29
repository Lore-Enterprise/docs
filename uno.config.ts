import { defineConfig, presetIcons, presetWebFonts, presetWind3, transformerDirectives } from "unocss"

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      extraProperties: {
        "vertical-align": "middle",
        "display": "inline-block",
        "font-size": "1.5rem",
      },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        inter: [
          {
            name: "Inter",
            weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
          },
          {
            name: "sans-serif",
            provider: "none",
          },
        ],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: {
    "container": "max-w-screen-xl mx-auto",
  },
  theme: {
    colors: {
      black: {
        DEFAULT: "#000000",
        main: "#111111",
        secondary: "#151515"
      },
      white: {
        DEFAULT: "#fff",
        darker: "#f5f5f5"
      },
      gray: {
        DEFAULT: "#9CA3AF",
        dark: "#5C5C5C",
        darker: "#363636",
        light: "#cccccc",
        text: "#8E8E8E",
        textLighter: "#9E9E9E",
      },
      brown: {
        dark: "#746052",
        light: "#d9ac8d",
      }
    },
  },
})