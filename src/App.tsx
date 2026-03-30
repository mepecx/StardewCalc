import { useState } from 'react'
import { SettingsProvider, useSettingsContext } from './context/SettingsContext'
import { TopBar } from './components/layout/TopBar'
import { AppShell } from './components/layout/AppShell'
import type { CropCategory } from './types'

function AppInner() {
  const { settings } = useSettingsContext()
  const [view, setView] = useState<'table' | 'chart'>('table')
  const [categoryFilter, setCategoryFilter] = useState<CropCategory | 'all'>('all')
  const [basicSourceOnly, setBasicSourceOnly] = useState(false)

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <TopBar view={view} onViewChange={setView} />
        <AppShell
          view={view}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          basicSourceOnly={basicSourceOnly}
          setBasicSourceOnly={setBasicSourceOnly}
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppInner />
    </SettingsProvider>
  )
}
