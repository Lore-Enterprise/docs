import { Route, Routes } from "react-router"
import { lazy, Suspense } from "react"

const modules = import.meta.glob("../docs/**/*.{md,mdx}")

/**
 * Collect an array with dynamic imports for loading components and paths for react-router from the modules object.
*/
const pageRoutes = Object.entries(modules).map(([path, load]) => {
  const cleanPath = path
    .replace("../docs", "")
    .replace(/\.mdx?$/, "")

  const Component = lazy(load as any)

  return {
    path: cleanPath === "/index" ? "/" : cleanPath,
    Component,
  }
})

export default function RoutesComponent() {
  return (
    <Routes>
      {pageRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Routes>
  )
}