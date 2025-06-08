import Sidebar from "./layout/sidebar/Sidebar.tsx"
import RoutesComponent from "./RoutesComponent.tsx"
import Header from "./layout/header/Header.tsx"

export default function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <div className="container">
          <RoutesComponent />
        </div>
      </main>
    </>
  )
}