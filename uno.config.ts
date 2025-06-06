import { defineConfig, presetIcons, presetWebFonts, presetWind3, transformerDirectives } from "unocss"

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      extraProperties: {
        "vertical-align": "middle",
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
  // shortcuts: {
  //   "container": "max-w-screen-xl mx-auto",
  // },
  theme: {
    colors: {
      black: {
        DEFAULT: "#000000",
        main: "#111111",
        secondary: "#151515"
      },
      gray: {
        DEFAULT: "#9CA3AF",
        dark: "#373737",
        light: "#cccccc"
      },
    },
  },
})