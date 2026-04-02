import { AppTopBar } from './components/layout/AppTopBar'
import { BottomNav } from './components/layout/BottomNav'
import { OnePage } from './pages/OnePage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <AppTopBar />
      <OnePage />
      <BottomNav />
    </div>
  )
}

export default App
