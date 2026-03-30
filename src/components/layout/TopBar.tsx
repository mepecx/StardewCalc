import { Tabs } from '../ui/Tabs'
import { useSettingsContext } from '../../context/SettingsContext'
import type { Season, CalcMode } from '../../types'

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

export function TopBar() {
  const { settings, updateSettings } = useSettingsContext()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2 mr-4 shrink-0">
        <span className="text-2xl" role="img" aria-label="Stardew Valley">🌾</span>
        <h1 className="text-lg font-bold text-gray-900">StardewCalc</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
        <div className="overflow-x-auto">
          <Tabs
            tabs={SEASON_TABS}
            value={settings.season}
            onChange={season => updateSettings({ season })}
            size="sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Tabs
            tabs={MODE_TABS}
            value={settings.mode}
            onChange={mode => updateSettings({ mode })}
            size="sm"
          />
        </div>
      </div>
    </header>
  )
}
