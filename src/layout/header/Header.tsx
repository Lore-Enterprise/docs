import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import styles from "./Header.module.css"

export default function Header() {
  const [value, setValue] = useLocalStorage('isDarkMode', true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [value])

  useEffect(() => {
    const elem = document.getElementById("sidebar") as HTMLElement
    if (isSidebarOpen) {
      elem.classList.add("open")
    } else {
      elem.classList.remove("open")
    }
  }, [isSidebarOpen])

  const toggleTheme = () => {
    setValue(!value)
  }

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
          <input type="text" className={styles.input} />
        </form>
        <button onClick={toggleTheme} className={styles.switchBtn}>
          <span className="i-solar:moon-linear dark:i-solar:sun-2-linear"></span>
        </button>
      </div>
    </header>
  )
}