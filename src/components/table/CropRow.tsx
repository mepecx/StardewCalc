import type { Crop, AnyResult, ProcessingResult, CompoundingResult } from '../../types'
import { CategoryBadge, SeedSourceBadge } from '../ui/Badge'
import { GoldIcon, formatGold } from '../ui/GoldIcon'
import { Tooltip } from '../ui/Tooltip'

interface Props {
  crop: Crop
  result: AnyResult | null
  isSelected: boolean
  onClick: () => void
  mode: string
}

export function CropRow({ crop, result, isSelected, onClick, mode }: Props) {
  const isNA = result === null

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
          <CategoryBadge category={crop.category} />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{crop.name}</span>
        </div>
      </td>

      {/* Seed cost */}
      <td className="px-3 py-2.5 text-right">
        <span className="inline-flex items-center justify-end gap-1 text-sm text-gray-700 dark:text-gray-300">
          <GoldIcon className="w-3.5 h-3.5" />
          {formatGold(crop.seedCost)}
        </span>
      </td>

      {/* Total profit */}
      <td className="px-3 py-2.5 text-right">
        {isNA ? (
          <Tooltip text="This crop cannot be processed with the selected processor">
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
