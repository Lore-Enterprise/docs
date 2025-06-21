import { useContext, useEffect, useState } from "react"
import { SearchContext } from "../context/SearchProvider.tsx"
import { type Results, search } from "@orama/orama"
import useDebounce from "./useDebounce.ts"

export function useSearch(input: string) {
  const { db, isIndexed } = useContext(SearchContext)
  const [isReady, setIsReady] = useState(false)
  const [results, setResults] = useState<Results<any>>()
  const debouncedInput = useDebounce(input, 3000)

  useEffect(() => {
    setIsReady(false)
    setResults(undefined)
    let isCanceled = false

    if (!isIndexed) return
    if (!debouncedInput) return

    const doSearch = async () => {
      const res = await search(db!, {
        term: debouncedInput,
        properties: ["title", "content"],
      })

      // Don't update state of the component has been unmounted
      if (isCanceled) return

      setResults(res)
      setIsReady(true)
    }

    doSearch()

    return () => {
      isCanceled = true
    }
  }, [isIndexed, debouncedInput])

  return { results, isReady }
}