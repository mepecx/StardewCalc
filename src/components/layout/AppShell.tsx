import { SettingsPanel } from '../settings/SettingsPanel'
import { CropTable } from '../table/CropTable'
import { DetailPanel } from '../detail/DetailPanel'
import { MobileDrawer } from '../detail/MobileDrawer'
import { ProfitBarChart } from '../chart/ProfitBarChart'
import type { CropCategory } from '../../types'

interface AppShellProps {
  view: 'table' | 'chart'
  categoryFilter: CropCategory | 'all'
  setCategoryFilter: (f: CropCategory | 'all') => void
  basicSourceOnly: boolean
  setBasicSourceOnly: (v: boolean) => void
}

export function AppShell({ view, categoryFilter, setCategoryFilter, basicSourceOnly, setBasicSourceOnly }: AppShellProps) {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden relative">
      {/* Left sidebar: settings */}
      <SettingsPanel />

      {/* Main content */}
      <main className="flex flex-1 min-w-0 overflow-auto flex-col">
        {view === 'table'
          ? <CropTable
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              basicSourceOnly={basicSourceOnly}
              setBasicSourceOnly={setBasicSourceOnly}
            />
          : <ProfitBarChart />
        }
      </main>

      {/* Right panel: detail (lg+ sidebar) */}
      <DetailPanel />

      {/* Mobile bottom drawer (< lg) */}
      <MobileDrawer />
    </div>
  )
}
