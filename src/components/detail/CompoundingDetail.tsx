import { useMemo } from 'react'
import type { Crop, CompoundingResult, CompoundingSnapshot, CompoundingAction } from '../../types'
import { GoldIcon, formatGold } from '../ui/GoldIcon'

interface Props {
  crop: Crop
  result: CompoundingResult
}

const ACTION_LABELS: Record<CompoundingAction, string> = {
  'plant': 'Plant',
  'harvest+processing': 'Harvest',
  'regrow': 'Regrow Harvest',
  'sell': 'Sell',
  'sell+replant': 'Sell + Replant',
  'final_sell': 'Final Sell',
}

const ACTION_ICONS: Record<CompoundingAction, string> = {
  'plant': '\u{1F331}',
  'harvest+processing': '\u{1F33E}',
  'regrow': '\u{1F504}',
  'sell': '\u{1F4B0}',
  'sell+replant': '\u{1F4B0}',
  'final_sell': '\u{2705}',
}

// Maximally distinct hues — ordered to avoid adjacent similarity
const BATCH_COLORS = [
  { bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-700', dot: 'bg-blue-500', text: 'text-blue-800 dark:text-blue-300' },
  { bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-300 dark:border-amber-700', dot: 'bg-amber-500', text: 'text-amber-800 dark:text-amber-300' },
  { bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30', border: 'border-fuchsia-300 dark:border-fuchsia-700', dot: 'bg-fuchsia-500', text: 'text-fuchsia-800 dark:text-fuchsia-300' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-500', text: 'text-emerald-800 dark:text-emerald-300' },
  { bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-300 dark:border-red-700', dot: 'bg-red-500', text: 'text-red-800 dark:text-red-300' },
  { bg: 'bg-cyan-50 dark:bg-cyan-900/30', border: 'border-cyan-300 dark:border-cyan-700', dot: 'bg-cyan-500', text: 'text-cyan-800 dark:text-cyan-300' },
  { bg: 'bg-violet-50 dark:bg-violet-900/30', border: 'border-violet-300 dark:border-violet-700', dot: 'bg-violet-500', text: 'text-violet-800 dark:text-violet-300' },
  { bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-700', dot: 'bg-orange-500', text: 'text-orange-800 dark:text-orange-300' },
]

function getBatchColor(batchId: number) {
  return BATCH_COLORS[batchId % BATCH_COLORS.length]
}

/** Group consecutive timeline events into "day groups" */
interface DayGroup {
  day: number
  events: CompoundingSnapshot[]
}

function groupByDay(timeline: CompoundingSnapshot[]): DayGroup[] {
  const groups: DayGroup[] = []
  for (const snap of timeline) {
    const last = groups[groups.length - 1]
    if (last && last.day === snap.day) {
      last.events.push(snap)
    } else {
      groups.push({ day: snap.day, events: [snap] })
    }
  }
  return groups
}

export function CompoundingDetail({ crop: _crop, result }: Props) {
  const dayGroups = useMemo(() => groupByDay(result.timeline), [result.timeline])
  const hasBatches = result.timeline.some(s => s.batchId !== undefined && s.batchId > 0)

  // Find unique batch IDs for legend
  const batchIds = useMemo(() => {
    const ids = new Set<number>()
    for (const s of result.timeline) {
      if (s.batchId !== undefined) ids.add(s.batchId)
    }
    return Array.from(ids).sort((a, b) => a - b)
  }, [result.timeline])

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Compounding Reinvest</h3>

      {/* Summary stats */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Reinvest Cycle</span><span className="dark:text-gray-200">{result.reinvestCycleDays} days</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Peak Seeds</span><span className="font-medium dark:text-gray-200">{result.peakSeeds}</span></div>
        <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-600 pt-2 mt-1">
          <span className="text-gray-500 dark:text-gray-400">Final Gold</span>
          <span className="flex items-center gap-1 dark:text-gray-100"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.finalGold)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500 dark:text-gray-400">Net Profit</span>
          <span className={`flex items-center gap-1 ${result.totalProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <GoldIcon className="w-3.5 h-3.5" />{formatGold(result.totalProfit)}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500 dark:text-gray-400">Profit / Day</span>
          <span className="flex items-center gap-1 dark:text-gray-100"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.profitPerDay)}/day</span>
        </div>
      </div>

      {/* Batch legend */}
      {hasBatches && (
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1.5">
          <p className="font-medium text-gray-600 dark:text-gray-300 mb-1">Batches:</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {batchIds.map(id => {
              const color = getBatchColor(id)
              return (
                <span key={id} className="inline-flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-sm ${color.dot}`} />
                  {id === 0 ? 'Original' : `Reinvest #${id}`}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timeline</h4>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-600" />

        <div className="space-y-1">
          {dayGroups.map((group, gi) => (
            <DayGroupCard key={gi} group={group} isLast={gi === dayGroups.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DayGroupCard({ group, isLast }: { group: DayGroup; isLast: boolean }) {
  const lastEvent = group.events[group.events.length - 1]

  return (
    <div className="relative pl-8">
      {/* Day dot on the timeline */}
      <div className={`absolute left-1.5 top-2.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 z-10 ${
        isLast ? 'bg-purple-500' : 'bg-blue-500'
      }`} />

      <div className="pb-2">
        {/* Day header */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Day {group.day}</span>
          <span className="text-xs text-gray-400">
            {formatGold(lastEvent.goldOnHand)} on hand
          </span>
        </div>

        {/* Events for this day */}
        <div className="space-y-1">
          {group.events.map((snap, i) => (
            <EventRow key={i} snap={snap} />
          ))}
        </div>

        {/* Cumulative profit after all events on this day */}
        <div className={`text-xs mt-1 font-medium ${lastEvent.cumulativeProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          Net: {formatGold(lastEvent.cumulativeProfit)}
        </div>
      </div>
    </div>
  )
}

function EventRow({ snap }: { snap: CompoundingSnapshot }) {
  const isHarvest = snap.action === 'harvest+processing' || snap.action === 'regrow'
  const isSell = snap.action === 'sell' || snap.action === 'sell+replant' || snap.action === 'final_sell'
  const batchColor = snap.batchId !== undefined ? getBatchColor(snap.batchId) : null

  return (
    <div className={`rounded px-2 py-1 text-xs flex items-center gap-1.5 ${
      batchColor && isHarvest
        ? `${batchColor.bg} border ${batchColor.border}`
        : isSell
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
    }`}>
      <span className="shrink-0">{ACTION_ICONS[snap.action]}</span>
      <span className={`font-medium ${batchColor && isHarvest ? batchColor.text : 'text-gray-700 dark:text-gray-300'}`}>
        {ACTION_LABELS[snap.action]}
      </span>
      {isHarvest && snap.batchTiles !== undefined && (
        <span className="text-gray-400 ml-auto">{snap.batchTiles} tiles</span>
      )}
      {snap.action === 'plant' && (
        <span className="text-gray-400 ml-auto">{snap.seeds} tiles</span>
      )}
      {isSell && snap.excessRevenue != null && snap.excessRevenue > 0 && (
        <span className="text-orange-500 dark:text-orange-400 ml-auto" title="Excess sold raw">
          +{formatGold(snap.excessRevenue)} raw
        </span>
      )}
      {snap.action === 'sell+replant' && snap.seeds > 0 && !snap.excessRevenue && (
        <span className="text-gray-400 ml-auto">{snap.seeds} tiles total</span>
      )}
      {snap.isJojaFallback && (
        <span className="text-blue-500 dark:text-blue-400 text-[10px] font-semibold ml-1" title="Seeds purchased from JojaMart (Pierre closed Wed)">
          Joja
        </span>
      )}
    </div>
  )
}
