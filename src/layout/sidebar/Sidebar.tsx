import { useEffect, useState } from "react"
import { SidebarItem } from "../../types/sidebar.ts"
import { NavLink } from "react-router"
import styles from "./Sidebar.module.css"
import clsx from "clsx"

export default function Sidebar() {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([])

  // loading JSON during runtime (for updating in dev mode)
  useEffect(() => {
    import("../../sidebar.json").then((data) => setSidebarItems(data.default || data))
  }, [])

  const renderItems = (items: SidebarItem[]) => (
    <ul className="no-before">
      {items.map((item) => (
        <li key={item.num}>
          { item.children ? (
            <>
              <h6>{item.title}</h6>
              {renderItems(item.children)}
            </>
          ) : (
            <NavLink
              to={{ pathname: item.path === "/index" ? "/" : item.path }}
              className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
            >
              {item.title}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <aside id="sidebar">
      <nav className={styles.nav}>
        {renderItems(sidebarItems)}
      </nav>
    </aside>
  )
}