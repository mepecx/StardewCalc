import { SettingsProvider } from './context/SettingsContext'
import { TopBar } from './components/layout/TopBar'
import { AppShell } from './components/layout/AppShell'

export default function App() {
  return (
    <SettingsProvider>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <TopBar />
        <AppShell />
      </div>
    </SettingsProvider>
  )
}
