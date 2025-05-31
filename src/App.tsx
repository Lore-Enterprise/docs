import Sidebar from "./layout/sidebar/Sidebar.tsx"
import RoutesComponent from "./RoutesComponent.tsx"
import Header from "./layout/header/Header.tsx"

export default function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <RoutesComponent />
      </main>
    </>
  )
}