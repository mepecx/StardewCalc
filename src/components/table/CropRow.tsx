import type { Crop, AnyResult, ProcessingResult, CompoundingResult } from '../../types'
import { CategoryBadge, SeedSourceBadge } from '../ui/Badge'
import { CropIcon } from '../ui/CropIcon'
import { GoldIcon, formatGold } from '../ui/GoldIcon'
import { Tooltip } from '../ui/Tooltip'
import { useSettingsContext } from '../../context/SettingsContext'
import { hasUnreliableSeedSource, resolvePurchase } from '../../calc/professionModifier'

interface Props {
  crop: Crop
  result: AnyResult | null
  isSelected: boolean
  onClick: () => void
  mode: string
}

export function CropRow({ crop, result, isSelected, onClick, mode }: Props) {
  const { settings } = useSettingsContext()
  const isNA = result === null
  const tiles = mode === 'compounding' ? 1 : Math.max(1, settings.tilesPlanted)
  const purchase = resolvePurchase(settings.startDay, crop, settings)
  const unitSeedCost = purchase.seedCost
  const totalSeedCost = unitSeedCost * tiles

  return (
    <tr
      onClick={onClick}
      className={`border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {/* Crop name + category */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <CropIcon cropId={crop.id} className="w-5 h-5" />
          <CategoryBadge category={crop.category} />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{crop.name}</span>
          <a
            href={`https://stardewvalleywiki.com/${crop.name.replace(/ /g, '_')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            title="View on Stardew Valley Wiki"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M4.5 2A2.5 2.5 0 002 4.5v11A2.5 2.5 0 004.5 18h11a2.5 2.5 0 002.5-2.5v-4a.75.75 0 00-1.5 0v4a1 1 0 01-1 1h-11a1 1 0 01-1-1v-11a1 1 0 011-1h4a.75.75 0 000-1.5h-4zm7 0a.75.75 0 000 1.5h2.69L8.22 9.47a.75.75 0 001.06 1.06l5.97-5.97V7.25a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5z" /></svg>
          </a>
          {hasUnreliableSeedSource(crop) && (
            <Tooltip text="Limited seed availability — no everyday shop source">
              <span className="text-amber-500 text-xs font-bold ml-0.5">!</span>
            </Tooltip>
          )}
        </div>
      </td>

      {/* Seed cost */}
      <td className="px-3 py-2.5 text-right">
        {tiles > 1 ? (
          <div className="text-right">
            <span className="inline-flex items-center justify-end gap-1 text-sm text-gray-700 dark:text-gray-300">
              <GoldIcon className="w-3.5 h-3.5" />
              {formatGold(totalSeedCost)}
              {purchase.isJojaFallback && <span className="text-blue-500 dark:text-blue-400 text-[10px] font-semibold">Joja</span>}
            </span>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {formatGold(unitSeedCost)} x {tiles}
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center justify-end gap-1 text-sm text-gray-700 dark:text-gray-300">
            <GoldIcon className="w-3.5 h-3.5" />
            {formatGold(unitSeedCost)}
            {purchase.isJojaFallback && <span className="text-blue-500 dark:text-blue-400 text-[10px] font-semibold">Joja</span>}
          </span>
        )}
      </td>

      {/* Total profit */}
      <td className="px-3 py-2.5 text-right">
        {isNA ? (
          mode === 'compounding' && hasUnreliableSeedSource(crop) && !settings.useSeedMaker
            ? <span className="text-xs text-amber-600 dark:text-amber-400">Seed Maker required</span>
            : <Tooltip text="This crop cannot be processed with the selected processor">
                <span className="text-sm text-gray-400">—</span>
              </Tooltip>
        ) : mode === 'processing' ? (
          <ProcessingBestCell result={result as ProcessingResult} />
        ) : (
          <ProfitCell value={result!.totalProfit} />
        )}
      </td>

      {/* Profit / day */}
      <td className="px-3 py-2.5 text-right">
        {isNA ? (
          <span className="text-sm text-gray-400">—</span>
        ) : (
          <span className="inline-flex items-center justify-end gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <GoldIcon className="w-3.5 h-3.5" />
            {formatGold(result!.profitPerDay)}/day
          </span>
        )}
      </td>

      {/* Harvests */}
      <td className="px-3 py-2.5 text-right text-sm text-gray-600 dark:text-gray-400">
        {isNA || mode === 'processing' ? '—' : result!.totalHarvests || '—'}
      </td>

      {/* Peak Seeds (compounding only) */}
      {mode === 'compounding' && (
        <td className="px-3 py-2.5 text-right text-sm text-gray-600 dark:text-gray-400">
          {isNA ? '—' : (result as CompoundingResult).peakSeeds ?? '—'}
        </td>
      )}

      {/* Seed sources */}
      <td className="px-3 py-2.5">
        <div className="flex flex-wrap gap-1">
          {crop.seedSource.map(src => (
            <SeedSourceBadge key={src} source={src} />
          ))}
          {(crop.yearAvailable ?? 1) >= 2 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
              Year {crop.yearAvailable}
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}

function ProfitCell({ value }: { value: number }) {
  const color = value >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  return (
    <span className={`inline-flex items-center justify-end gap-1 text-sm font-medium ${color}`}>
      <GoldIcon className="w-3.5 h-3.5" />
      {formatGold(value)}
    </span>
  )
}

function ProcessingBestCell({ result }: { result: ProcessingResult }) {
  const best = result.variants[0]
  if (!best) return <span className="text-sm text-gray-400">—</span>
  return (
    <Tooltip text={`Best: ${best.outputName}`}>
      <span className="inline-flex items-center justify-end gap-1 text-sm font-medium text-green-700 dark:text-green-400">
        <GoldIcon className="w-3.5 h-3.5" />
        {formatGold(best.totalProfit)}
      </span>
    </Tooltip>
  )
}
