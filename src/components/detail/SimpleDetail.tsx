import type { Crop, SimpleResult } from '../../types'
import { GoldIcon, formatGold } from '../ui/GoldIcon'
import { useSettingsContext } from '../../context/SettingsContext'

interface Props {
  crop: Crop
  result: SimpleResult
}

export function SimpleDetail({ crop, result }: Props) {
  const { settings } = useSettingsContext()
  const breakEvenDay = result.totalProfit >= 0
    ? settings.startDay + result.effectiveDays
    : null

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Single Harvest Breakdown</h3>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 text-sm">
        <Row label="Grow Time" value={`${crop.growDays} days`} />
        {result.effectiveDays > crop.growDays && (
          <Row
            label="Processing Time"
            value={`${(result.effectiveDays - crop.growDays).toFixed(1)} days`}
          />
        )}
        <Row label="Effective Days" value={`${result.effectiveDays.toFixed(1)} days`} />
        <Row label="Expected Yield" value={`${(crop.baseYield + crop.extraYieldChance).toFixed(2)}`} />
        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
          <Row label="Revenue" value={formatGold(result.revenue)} gold />
          <Row label="Seed Cost" value={`-${formatGold(result.seedCost)}`} negative />
          <Row label="Net Profit" value={formatGold(result.totalProfit)} gold bold />
          <Row label="Profit / Day" value={`${formatGold(result.profitPerDay)}/day`} gold bold />
          {breakEvenDay !== null
            ? <Row label="Break-even" value={`Day ${breakEvenDay}`} positive bold />
            : <Row label="Break-even" value="Unprofitable" negative bold />
          }
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  gold,
  negative,
  positive,
  bold,
}: {
  label: string
  value: string
  gold?: boolean
  negative?: boolean
  positive?: boolean
  bold?: boolean
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold' : ''}`}>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`flex items-center gap-1 ${
        negative ? 'text-red-600 dark:text-red-400'
        : positive ? 'text-green-700 dark:text-green-400'
        : gold ? 'text-gray-900 dark:text-gray-100'
        : 'text-gray-700 dark:text-gray-300'
      }`}>
        {gold && <GoldIcon className="w-3.5 h-3.5" />}
        {value}
      </span>
    </div>
  )
}
