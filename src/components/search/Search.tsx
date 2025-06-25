import { useState } from "react"
import styles from "./Search.module.css"

export default function Search() {
  const [inputValue, setInputValue] = useState("")

  return (
    <aside id="search">
      <form action="">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className={styles.input}
        />
      </form>
    </aside>
  )
}