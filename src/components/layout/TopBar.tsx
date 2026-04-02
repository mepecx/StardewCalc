import { Tabs } from '../ui/Tabs'
import { useSettingsContext } from '../../context/SettingsContext'
import type { AppMode, Season, CalcMode } from '../../types'

const APP_MODE_TABS: { value: AppMode; label: string }[] = [
  { value: 'crops', label: '🌾 Crops' },
  { value: 'animals', label: '🐔 Animals' },
]

const SEASON_TABS: { value: Season; label: string }[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
  { value: 'greenhouse', label: 'Greenhouse' },
]

const MODE_TABS: { value: CalcMode; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'fullSeason', label: 'Full Season' },
  { value: 'compounding', label: 'Compounding' },
  { value: 'processing', label: 'Processing' },
]

const VIEW_TABS: { value: 'table' | 'chart'; label: string }[] = [
  { value: 'table', label: '☰ Table' },
  { value: 'chart', label: '▐ Chart' },
]

interface TopBarProps {
  view: 'table' | 'chart'
  onViewChange: (v: 'table' | 'chart') => void
}

export function TopBar({ view, onViewChange }: TopBarProps) {
  const { settings, updateSettings } = useSettingsContext()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
      {/* Primary bar: logo, app mode, dark mode */}
      <div className="px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <span className="text-2xl" role="img" aria-label="Stardew Valley">🌾</span>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">StardewCalc</h1>
        </div>

        <div className="overflow-x-auto">
          <Tabs
            tabs={APP_MODE_TABS}
            value={settings.appMode}
            onChange={appMode => updateSettings({ appMode })}
          />
        </div>

        <div className="flex-1" />

        <button
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
          className="shrink-0 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Toggle dark mode"
          title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {settings.darkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Secondary bar: mode-specific tabs */}
      {settings.appMode === 'crops' && (
        <div className="px-4 pb-2.5 flex gap-2 overflow-x-auto">
          <Tabs
            tabs={SEASON_TABS}
            value={settings.season}
            onChange={season => updateSettings({ season })}
            size="sm"
          />
          <Tabs
            tabs={MODE_TABS}
            value={settings.mode}
            onChange={mode => updateSettings({ mode })}
            size="sm"
          />
          <Tabs
            tabs={VIEW_TABS}
            value={view}
            onChange={onViewChange}
            size="sm"
          />
        </div>
      )}
    </header>
  )
}
