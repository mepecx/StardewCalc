import { SettingsPanel } from '../settings/SettingsPanel'
import { CropTable } from '../table/CropTable'
import { DetailPanel } from '../detail/DetailPanel'

export function AppShell() {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left sidebar: settings */}
      <SettingsPanel />

      {/* Main content: crop table */}
      <main className="flex flex-1 min-w-0 overflow-auto flex-col">
        <CropTable />
      </main>

      {/* Right panel: detail */}
      <DetailPanel />
    </div>
  )
}
