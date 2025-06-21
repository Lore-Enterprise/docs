import { createContext, ReactNode, useEffect, useState } from "react"
import { create, insert, Orama } from "@orama/orama"
import { extractFrontmatter } from "./utils.ts"

interface ContextType {
  db?: Orama<any>
  isIndexed: boolean
}

export const SearchContext = createContext<ContextType>({ isIndexed: false })

const DOCS = import.meta.glob("/docs/**/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
})

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Orama<any>>()
  const [isIndexed, setIsIndexed] = useState<boolean>(false)

  useEffect(() => {
    setIsIndexed(false)
    setDb(undefined)
    let isInitCanceled = false

    const initOrama = async () => {
      const schemaDb = create({
        schema: {
          path: "string",
          title: "string",
          content: "string",
        },
      })

      // Stop indexing if the component has been unmounted
      if (isInitCanceled) return

      for (const path in DOCS) {
        const raw = DOCS[path] as string
        const { data, content } = extractFrontmatter(raw)
        const title = data["sidebar-title"]

        await insert(schemaDb, { path, title, content })
      }

      // Don't update state if the component has been unmounted
      if (isInitCanceled) return

      setIsIndexed(true)
      setDb(schemaDb)
    }

    initOrama().then(r => r)

    return () => {
      isInitCanceled = true
    }
  }, [])

  return (
    <SearchContext value={{ db, isIndexed }}>{children}</SearchContext>
  )
}