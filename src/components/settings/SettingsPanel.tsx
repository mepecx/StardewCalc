import { useState } from 'react'
import { useSettingsContext } from '../../context/SettingsContext'
import type { SellMode, Fertilizer, FertilizerSource } from '../../types'
import speedGroImg from '../../img/SpeedGro.png'
import deluxeSpeedGroImg from '../../img/DeluxeSpeedGro.png'

const SELL_MODE_OPTIONS: { value: SellMode; label: string }[] = [
  { value: 'raw', label: 'Raw' },
  { value: 'preservesJar', label: 'Preserves Jar' },
  { value: 'keg', label: 'Keg' },
  { value: 'dehydrator', label: 'Dehydrator' },
  { value: 'oilMaker', label: 'Oil Maker' },
]

const FERTILIZER_OPTIONS: { value: Fertilizer; label: string; img?: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'speedGro', label: 'Speed-Gro (-10%)', img: speedGroImg },
  { value: 'deluxeSpeedGro', label: 'Deluxe (-25%)', img: deluxeSpeedGroImg },
]

const FERTILIZER_SOURCE_OPTIONS: { value: FertilizerSource; label: string }[] = [
  { value: 'pierre', label: "Pierre's" },
  { value: 'sandy', label: "Sandy's Oasis" },
]

function fertilizerPrice(fert: Fertilizer, source: FertilizerSource): number {
  if (fert === 'none') return 0
  if (fert === 'speedGro') return 100
  return source === 'sandy' ? 80 : 150
}

const selectClass = 'w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
const inputClass = selectClass
const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'
const checkboxLabelClass = 'flex items-center gap-2 cursor-pointer'
const checkboxTextClass = 'text-sm text-gray-700 dark:text-gray-300'

/** Collapsible section — uses overflow-visible so contents aren't clipped */
function SettingsGroup({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border border-gray-200 dark:border-gray-600 rounded-lg">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg focus:outline-none"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-3 pb-3 pt-1 space-y-3 border-t border-gray-100 dark:border-gray-600">{children}</div>}
    </section>
  )
}

export function SettingsPanel() {
  const { settings, updateSettings } = useSettingsContext()
  const [open, setOpen] = useState(true)
  const isCompounding = settings.mode === 'compounding'
  const isProcessing = settings.mode === 'processing'
  const isGreenhouse = settings.season === 'greenhouse'

  const hasFertilizer = settings.fertilizer !== 'none'
  const fertPrice = fertilizerPrice(settings.fertilizer, settings.fertilizerSource)

  // --- Reusable section blocks ---

  const calendarSection = (
    <section>
      <label className={labelClass}>Start Day</label>
      <DayCalendar value={settings.startDay} onChange={d => updateSettings({ startDay: d })} />
    </section>
  )

  const tilesSection = (
    <section>
      <label className={labelClass}>Tiles Planted</label>
      <input
        type="number"
        min={1}
        value={settings.tilesPlanted}
        onChange={e => updateSettings({ tilesPlanted: Math.max(1, Math.round(Number(e.target.value))) })}
        className={inputClass}
      />
      <p className="text-xs text-gray-400 mt-1">How many crop tiles you have</p>
    </section>
  )

  const sellAsSection = !isProcessing ? (
    <section>
      <label className={labelClass}>Sell As</label>
      <select
        value={settings.sellMode}
        onChange={e => updateSettings({ sellMode: e.target.value as SellMode })}
        className={selectClass}
      >
        {SELL_MODE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </section>
  ) : null

  const machinesSection = !isProcessing && settings.sellMode !== 'raw' ? (
    <section>
      <p className={labelClass}>Machines</p>
      <label className={`${checkboxLabelClass} mb-2`}>
        <input
          type="checkbox"
          checked={settings.unlimitedMachines}
          onChange={e => updateSettings({ unlimitedMachines: e.target.checked })}
          className="accent-green-600 w-4 h-4"
        />
        <span className={checkboxTextClass}>Unlimited</span>
      </label>
      {!settings.unlimitedMachines && (
        <>
          <input
            type="number"
            min={1}
            value={settings.machineCount}
            onChange={e => updateSettings({ machineCount: Math.max(1, Math.round(Number(e.target.value))) })}
            className={`${inputClass} mb-2`}
            placeholder="# of machines"
          />
          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              checked={settings.sellExcessRaw}
              onChange={e => updateSettings({ sellExcessRaw: e.target.checked })}
              className="accent-green-600 w-4 h-4"
            />
            <span className={checkboxTextClass}>Sell excess as raw</span>
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-6">Crops that can't be processed are sold at base price</p>
        </>
      )}
    </section>
  ) : null

  const fertilizerSection = (
    <SettingsGroup title="Fertilizer">
      <div className="flex flex-col gap-1">
        {FERTILIZER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => updateSettings({ fertilizer: opt.value })}
            className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
              settings.fertilizer === opt.value
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-1 ring-green-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {opt.img && (
              <img src={opt.img} alt="" className="w-5 h-5 shrink-0" style={{ imageRendering: 'pixelated' }} draggable={false} />
            )}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {hasFertilizer && (
        <>
          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              checked={settings.payForFertilizer}
              onChange={e => updateSettings({ payForFertilizer: e.target.checked })}
              className="accent-green-600 w-4 h-4"
            />
            <span className={checkboxTextClass}>Pay for fertilizer</span>
          </label>

          {settings.payForFertilizer && (
            <div>
              <label className={labelClass}>Buy from</label>
              <select
                value={settings.fertilizerSource}
                onChange={e => updateSettings({ fertilizerSource: e.target.value as FertilizerSource })}
                className={selectClass}
              >
                {FERTILIZER_SOURCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">{fertPrice}g per tile</p>
            </div>
          )}
        </>
      )}
    </SettingsGroup>
  )

  const levelsSection = (
    <SettingsGroup title="Levels">
      <div>
        <label className={labelClass}>
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
      </div>

      <div>
        <p className={labelClass}>Professions</p>
        <div className="flex flex-col gap-2">
          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              checked={settings.tillerProfession}
              onChange={e => updateSettings({ tillerProfession: e.target.checked })}
              className="accent-green-600 w-4 h-4"
            />
            <span className={checkboxTextClass}>Tiller <span className="text-xs text-gray-400">(+10% crops)</span></span>
          </label>
          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              checked={settings.artisanProfession}
              onChange={e => updateSettings({ artisanProfession: e.target.checked })}
              className="accent-green-600 w-4 h-4"
            />
            <span className={checkboxTextClass}>Artisan <span className="text-xs text-gray-400">(+40% processed)</span></span>
          </label>
        </div>
      </div>

      <div>
        <label className={checkboxLabelClass}>
          <input
            type="checkbox"
            checked={settings.qualityEnabled}
            onChange={e => updateSettings({ qualityEnabled: e.target.checked })}
            className="accent-green-600 w-4 h-4"
          />
          <span className={checkboxTextClass}>Quality bonus</span>
        </label>
        <p className="text-xs text-gray-400 mt-1 ml-6">Weighted avg. by farming level</p>
      </div>
    </SettingsGroup>
  )

  const pierreSection = (
    <section className="space-y-2">
      <label className={checkboxLabelClass}>
        <input
          type="checkbox"
          checked={settings.pierreOpenWednesday}
          onChange={e => updateSettings({ pierreOpenWednesday: e.target.checked })}
          className="accent-green-600 w-4 h-4"
        />
        <span className={checkboxTextClass}>Pierre open Wed.</span>
      </label>
      <p className="text-xs text-gray-400 mt-1 ml-6">CC complete or town key</p>
      <label className={checkboxLabelClass}>
        <input
          type="checkbox"
          checked={settings.jojaAvailable}
          onChange={e => updateSettings({ jojaAvailable: e.target.checked })}
          className="accent-green-600 w-4 h-4"
        />
        <span className={checkboxTextClass}>Joja available</span>
      </label>
      <p className="text-xs text-gray-400 mt-1 ml-6">Buy seeds from JojaMart (25% markup)</p>
    </section>
  )

  const greenhouseSection = isGreenhouse ? (
    <section>
      <label className={labelClass}>
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
  ) : null

  const startingGoldSection = (
    <section>
      <label className={labelClass}>Starting Seed Money</label>
      <div className="relative">
        <input
          type="number"
          min={0}
          step={100}
          value={settings.startingGold}
          onChange={e => updateSettings({ startingGold: Math.max(0, Math.round(Number(e.target.value))) })}
          className={`${inputClass} pr-6`}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
      </div>
    </section>
  )

  const maxSeedsSection = (
    <section>
      <p className={labelClass}>Max Seeds</p>
      <label className={`${checkboxLabelClass} mb-2`}>
        <input
          type="checkbox"
          checked={settings.unlimitedMaxSeeds}
          onChange={e => updateSettings({ unlimitedMaxSeeds: e.target.checked })}
          className="accent-green-600 w-4 h-4"
        />
        <span className={checkboxTextClass}>Unlimited</span>
      </label>
      {!settings.unlimitedMaxSeeds && (
        <input
          type="number"
          min={1}
          value={settings.maxSeeds}
          onChange={e => updateSettings({ maxSeeds: Math.max(1, Math.round(Number(e.target.value))) })}
          className={inputClass}
          placeholder="Max seeds"
        />
      )}
      <p className="text-xs text-gray-400 mt-1">Cap on seeds bought during compounding</p>
    </section>
  )

  const seedMakerSection = (settings.mode === 'fullSeason' || settings.mode === 'compounding') ? (
    <section>
      <label className={checkboxLabelClass}>
        <input
          type="checkbox"
          checked={settings.useSeedMaker}
          onChange={e => updateSettings({ useSeedMaker: e.target.checked })}
          className="accent-green-600 w-4 h-4"
        />
        <span className={checkboxTextClass}>Use Seed Maker</span>
      </label>
      <p className="text-xs text-gray-400 mt-1 ml-6">
        {isCompounding
          ? 'Divert crops to seed maker instead of buying seeds'
          : 'Assume seeds from seed maker (no purchase cost)'}
      </p>
    </section>
  ) : null

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
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
          {isCompounding ? (
            <>
              {/* Compounding order: calendar, starting gold, seed maker, max seeds, sell as, machines, fertilizer, levels, pierre, greenhouse */}
              {calendarSection}
              {startingGoldSection}
              {seedMakerSection}
              {maxSeedsSection}
              {sellAsSection}
              {machinesSection}
              {fertilizerSection}
              {levelsSection}
              {pierreSection}
              {greenhouseSection}
            </>
          ) : (
            <>
              {/* Default order: calendar, tiles, seed maker, sell as, machines, fertilizer, levels, pierre, greenhouse */}
              {calendarSection}
              {tilesSection}
              {seedMakerSection}
              {sellAsSection}
              {machinesSection}
              {fertilizerSection}
              {levelsSection}
              {pierreSection}
              {greenhouseSection}
            </>
          )}
        </div>
      )}
    </aside>
  )
}

const WEEKDAYS = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']

function DayCalendar({ value, onChange }: { value: number; onChange: (day: number) => void }) {
  return (
    <div className="select-none">
      <div className="grid grid-cols-7 mb-0.5">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1
          const selected = day === value
          return (
            <button
              key={day}
              onClick={() => onChange(day)}
              className={`aspect-square flex items-center justify-center text-xs rounded transition-colors ${
                selected
                  ? 'bg-green-500 text-white font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
