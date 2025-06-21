import { useLocalStorage } from "usehooks-ts"
import { useEffect } from "react"

export default function useDarkMode(): {
  toggleDarkMode: () => void,
  isDarkMode: boolean,
  setDarkMode: (value: (((prevState: boolean) => boolean) | boolean)) => void
} {
  const [value, setValue] = useLocalStorage("isDarkMode", true)

  useEffect(() => {
    if (value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [value])

  const toggleValue = () => setValue(!value)

  return {
    isDarkMode: value,
    setDarkMode: setValue,
    toggleDarkMode: toggleValue,
  }
}