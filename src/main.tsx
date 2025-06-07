import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App.tsx"
/* STYLES */
import "virtual:uno.css"
import "@unocss/reset/tailwind-compat.css"
import "./index.css"

const isProd = import.meta.env.MODE === "production"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={isProd ? "/docs" : "/"}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
