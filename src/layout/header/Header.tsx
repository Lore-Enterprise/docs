import { useEffect, useRef, useState } from "react"
import useDarkMode from "../../hooks/useDarkMode.ts"
import styles from "./Header.module.css"
import { useSearch } from "../../hooks/useSearch.ts"
import clsx from "clsx"

export default function Header() {
  /* States */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  /* Custom Hooks */
  const { toggleDarkMode } = useDarkMode()
  const { results, isReady, clear } = useSearch(inputValue)
  /* Refs */
  const inputRef = useRef<HTMLInputElement>(null)

  console.log(isReady, ' - ' ,results)

  useEffect(() => {
    const elem = document.getElementById("sidebar") as HTMLElement
    if (isSidebarOpen) {
      elem.classList.add("open")
    } else {
      elem.classList.remove("open")
    }
  }, [isSidebarOpen])

  useEffect(() => {
    const elem = document.getElementById("search") as HTMLElement
    if (isSearchOpen) {
      elem.classList.add("open")
    } else {
      elem.classList.remove("open")
    }
  }, [isSearchOpen])

  const toggleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  const toggleSearchOpen = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const clearInput = () => {
    setInputValue('')
    clear()
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <header className={styles.header}>
      <div className="flex items-center space-x-xs">
        <button onClick={toggleSidebarOpen} className={styles.burgerMenuBtn}>
          <span className={isSidebarOpen ? "i-solar:close-square-linear" : "i-solar:menu-dots-square-linear"}>
          </span>
        </button>
        <div className="font-600 text-xl leading-none">Documentation</div>
      </div>

      <div className="flex items-center space-x-xs">
        <form action="" className="lg:hidden relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className={styles.input}
          />
          <button type="button" onClick={clearInput} className={clsx(styles.inputClearBtn, !inputValue && "hidden")}>
            <span className="i-iconamoon:close"></span>
          </button>
        </form>
        <button onClick={toggleSearchOpen} className={clsx(styles.searchBtn, isSearchOpen && styles.searchBtnOpen)}>
          <span className="i-iconamoon:search"></span>
        </button>

        <button onClick={toggleDarkMode} className={styles.switchBtn}>
          <span className="i-solar:moon-linear dark:i-solar:sun-2-linear"></span>
        </button>
      </div>
    </header>
  )
}