import { useId, useRef, useState } from "react"
import { useSearch } from "../../hooks/useSearch.ts"
import styles from "./Search.module.css"
import clsx from "clsx"

export default function Search() {
  /* States */
  const [inputValue, setInputValue] = useState("")
  /* Custom Hooks */
  const { results, isReady, clear } = useSearch(inputValue)
  /* Refs, id, etc */
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputId = useId()

  const clearInput = () => {
    setInputValue('')
    clear()
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <aside id="search">
      <form action="" className="mb-2.5 relative overflow-hidden">
        <input
          id={searchInputId}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className={styles.input}
          required
        />
        <label htmlFor={searchInputId} className={styles.label}>
          <span className="i-iconamoon:search mr-1"></span> Search
        </label>
        <button
          type="button"
          onClick={clearInput}
          className={clsx(styles.inputClearBtn, !inputValue && styles.inputClearBtnHidden)}
        >
          <span className="i-iconamoon:close"></span>
        </button>
      </form>

      <div className="overflow-y-auto h-full">
        {isReady ?
          (results?.hits.map(item => (
            <div>
              <h6>{item.document.title}</h6>
              <p>{item.document.content}</p>
            </div>
          ))) :
          <div className="text-center dark:text-gray-textLighter">Nothing was found :(</div>
        }
      </div>
    </aside>
  )
}