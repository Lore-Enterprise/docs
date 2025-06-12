import { useEffect, useState } from "react"
import { useSearch } from "../../hooks/useSearch.ts"
import useDarkMode from "../../hooks/useDarkMode.ts"
import styles from "./Header.module.css"

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const { toggleDarkMode } = useDarkMode()

  useEffect(() => {
    useSearch(inputValue).then(console.log)
  }, [inputValue])

  useEffect(() => {
    const elem = document.getElementById("sidebar") as HTMLElement
    if (isSidebarOpen) {
      elem.classList.add("open")
    } else {
      elem.classList.remove("open")
    }
  }, [isSidebarOpen])

  const toggleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen)
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
        <form action="">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className={styles.input}
          />
        </form>
        <button onClick={toggleDarkMode} className={styles.switchBtn}>
          <span className="i-solar:moon-linear dark:i-solar:sun-2-linear"></span>
        </button>
      </div>
    </header>
  )
}