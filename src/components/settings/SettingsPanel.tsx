import { useState } from 'react'
import { useSettingsContext } from '../../context/SettingsContext'
import type { SellMode, Fertilizer } from '../../types'

const FERTILIZER_OPTIONS: { value: Fertilizer; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'speedGro', label: 'Speed-Gro (-10%)' },
  { value: 'deluxeSpeedGro', label: 'Deluxe (-25%)' },
]

const SELL_MODE_OPTIONS: { value: SellMode; label: string }[] = [
  { value: 'raw', label: 'Raw' },
  { value: 'preservesJar', label: 'Preserves Jar' },
  { value: 'keg', label: 'Keg' },
  { value: 'dehydrator', label: 'Dehydrator' },
  { value: 'oilMaker', label: 'Oil Maker' },
]

export function SettingsPanel() {
  const { settings, updateSettings } = useSettingsContext()
  const [open, setOpen] = useState(true)
  const isCompounding = settings.mode === 'compounding'
  const isProcessing = settings.mode === 'processing'
  const isGreenhouse = settings.season === 'greenhouse'

  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 w-full sm:w-60">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 focus:outline-none"
        aria-expanded={open}
      >
        <span>Settings</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-5 p-4 overflow-y-auto">

          {/* Sell Mode */}
          {!isProcessing && (
            <section>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Sell As
              </label>
              <div className="flex flex-col gap-1">
                {SELL_MODE_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sellMode"
                      value={opt.value}
                      checked={settings.sellMode === opt.value}
                      onChange={() => updateSettings({ sellMode: opt.value })}
                      className="accent-green-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Fertilizer */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Fertilizer
            </label>
            <div className="flex flex-col gap-1">
              {FERTILIZER_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fertilizer"
                    value={opt.value}
                    checked={settings.fertilizer === opt.value}
                    onChange={() => updateSettings({ fertilizer: opt.value })}
                    className="accent-green-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Machines */}
          {!isProcessing && settings.sellMode !== 'raw' && (
            <section>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Machines</p>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={settings.unlimitedMachines}
                  onChange={e => updateSettings({ unlimitedMachines: e.target.checked })}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited</span>
              </label>
              {!settings.unlimitedMachines && (
                <>
                  <input
                    type="number"
                    min={1}
                    value={settings.machineCount}
                    onChange={e => updateSettings({ machineCount: Math.max(1, Math.round(Number(e.target.value))) })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                    placeholder="# of machines"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.sellExcessRaw}
                      onChange={e => updateSettings({ sellExcessRaw: e.target.checked })}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sell excess as raw</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1 ml-6">Crops that can't be processed are sold at base price</p>
                </>
              )}
            </section>
          )}

          {/* Tiles Planted */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Tiles Planted
            </label>
            <input
              type="number"
              min={1}
              value={settings.tilesPlanted}
              onChange={e => updateSettings({ tilesPlanted: Math.max(1, Math.round(Number(e.target.value))) })}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">How many crop tiles you have</p>
          </section>

          {/* Start Day */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Start Day: <span className="text-gray-900 dark:text-gray-100 font-bold">{settings.startDay}</span>
            </label>
            <input
              type="range"
              min={1}
              max={27}
              value={settings.startDay}
              onChange={e => updateSettings({ startDay: Number(e.target.value) })}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>Day 1</span>
              <span>Day 27</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Season day you start planting</p>
          </section>

          {/* Farming Level */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Farming Level: <span className="text-gray-900 dark:text-gray-100 font-bold">{settings.farmingLevel}</span>
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={settings.farmingLevel}
              onChange={e => updateSettings({ farmingLevel: Number(e.target.value) })}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>0</span>
              <span>10</span>
            </div>
          </section>

          {/* Professions */}
          <section>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Professions</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tillerProfession}
                  onChange={e => updateSettings({ tillerProfession: e.target.checked })}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Tiller <span className="text-xs text-gray-400">(+10% crops)</span></span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.artisanProfession}
                  onChange={e => updateSettings({ artisanProfession: e.target.checked })}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Artisan <span className="text-xs text-gray-400">(+40% processed)</span></span>
              </label>
            </div>
          </section>

          {/* Quality */}
          <section>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.qualityEnabled}
                onChange={e => updateSettings({ qualityEnabled: e.target.checked })}
                className="accent-green-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Quality bonus</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-6">Weighted avg. by farming level</p>
          </section>

          {/* Greenhouse seasons */}
          {isGreenhouse && (
            <section>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Greenhouse Seasons: <span className="text-gray-900 dark:text-gray-100 font-bold">{settings.greenhouseSeasons}</span>
              </label>
              <input
                type="range"
                min={1}
                max={12}
                value={settings.greenhouseSeasons}
                onChange={e => updateSettings({ greenhouseSeasons: Number(e.target.value) })}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>1</span>
                <span>12</span>
              </div>
            </section>
          )}

          {/* Starting Gold (Compounding) */}
          {isCompounding && (
            <>
              <section>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Starting Gold
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={settings.startingGold}
                    onChange={e => updateSettings({ startingGold: Math.max(0, Math.round(Number(e.target.value))) })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
                </div>
              </section>

              <section>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Max Seeds</p>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={settings.unlimitedMaxSeeds}
                    onChange={e => updateSettings({ unlimitedMaxSeeds: e.target.checked })}
                    className="accent-green-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited</span>
                </label>
                {!settings.unlimitedMaxSeeds && (
                  <input
                    type="number"
                    min={1}
                    value={settings.maxSeeds}
                    onChange={e => updateSettings({ maxSeeds: Math.max(1, Math.round(Number(e.target.value))) })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Max seeds"
                  />
                )}
                <p className="text-xs text-gray-400 mt-1">Cap on seeds bought during compounding</p>
              </section>
            </>
          )}
        </div>
      )}
    </aside>
  )
}
