import Sidebar from "./layout/sidebar/Sidebar.tsx"
import RoutesComponent from "./RoutesComponent.tsx"
import Header from "./layout/header/Header.tsx"
import SearchProvider from "./context/SearchProvider.tsx"

export default function App() {
  return (
    <SearchProvider>
      <Header />
      <Sidebar />
      <main>
        <div className="container">
          <RoutesComponent />
        </div>
      </main>
    </SearchProvider>
  )
}