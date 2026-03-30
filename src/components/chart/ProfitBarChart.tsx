import { useMemo } from 'react'
import { useCalcResults } from '../../hooks/useCalcResults'
import { useSettingsContext } from '../../context/SettingsContext'
import { getCropsForSeason } from '../../data'
import { formatGold } from '../ui/GoldIcon'

const CATEGORY_COLORS: Record<string, string> = {
  vegetable: 'bg-green-400',
  fruit: 'bg-red-400',
  flower: 'bg-pink-400',
  forage: 'bg-lime-400',
  gem_crop: 'bg-violet-400',
}

const MODE_LABELS: Record<string, string> = {
  simple: 'Simple (1 grow)',
  fullSeason: 'Full Season',
  compounding: 'Compounding',
  processing: 'Best Processor',
}

export function ProfitBarChart() {
  const { settings, selectedCropId, setSelectedCropId } = useSettingsContext()
  const crops = useMemo(() => getCropsForSeason(settings.season), [settings.season])
  const items = useCalcResults(crops, settings)

  const sorted = useMemo(() => {
    return items
      .filter(x => x.result !== null)
      .sort((a, b) => (b.result?.profitPerDay ?? 0) - (a.result?.profitPerDay ?? 0))
  }, [items])

  if (sorted.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No crops with valid results for this season / settings.
      </div>
    )
  }

  const maxVal = Math.max(...sorted.map(x => x.result?.profitPerDay ?? 0), 1)

  return (
    <div className="flex-1 overflow-auto p-4">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Profit / Day — {MODE_LABELS[settings.mode]}
      </h2>

      <div className="space-y-1.5 min-w-0">
        {sorted.map(({ crop, result }) => {
          const ppd = result?.profitPerDay ?? 0
          const fraction = maxVal > 0 ? Math.max(0, ppd) / maxVal : 0
          const isSelected = selectedCropId === crop.id
          const isNegative = ppd < 0
          const barColor = isNegative
            ? 'bg-red-400'
            : (CATEGORY_COLORS[crop.category] ?? 'bg-slate-400')

          return (
            <div
              key={crop.id}
              onClick={() => setSelectedCropId(isSelected ? null : crop.id)}
              className={`flex items-center gap-2 rounded-md px-2 py-1 cursor-pointer transition-colors group ${
                isSelected
                  ? 'bg-green-50 dark:bg-green-900/20 ring-1 ring-green-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {/* Crop name */}
              <span
                className={`w-28 shrink-0 text-xs truncate ${
                  isSelected ? 'font-semibold text-green-800 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
                }`}
                title={crop.name}
              >
                {crop.name}
              </span>

              {/* Bar track */}
              <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-200 ${barColor} ${
                    isSelected ? 'opacity-100' : 'opacity-75 group-hover:opacity-90'
                  }`}
                  style={{ width: `${(fraction * 100).toFixed(1)}%` }}
                />
              </div>

              {/* Value */}
              <span
                className={`w-24 shrink-0 text-right text-xs font-semibold tabular-nums ${
                  isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {formatGold(ppd)}/day
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-5 text-xs text-gray-500 dark:text-gray-400">
        {Object.entries(CATEGORY_COLORS).map(([cat, colorClass]) => (
          <span key={cat} className="flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${colorClass}`} />
            {cat.replace('_', ' ')}
          </span>
        ))}
      </div>
    </div>
  )
}
