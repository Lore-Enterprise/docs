import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"
import styles from "./Header.module.css"

export default function Header() {
  const [value, setValue] = useLocalStorage('isDarkMode', true)

  useEffect(() => {
    if (value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [value])

  const toggle = () => {
    setValue(!value)
  }

  return (
    <header className={styles.header}>
      <div className="font-600 text-xl leading-none">Documentation</div>
      <div className="flex items-center space-x-xs">
        <form action="">
          <input type="text" className={styles.input} />
        </form>
        <button onClick={toggle} className={styles.switchBtn}>
          <span className="i-solar:moon-linear dark:i-solar:sun-2-linear"></span>
        </button>
      </div>
    </header>
  )
}