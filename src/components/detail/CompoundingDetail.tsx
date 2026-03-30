import type { Crop, CompoundingResult } from '../../types'
import { GoldIcon, formatGold } from '../ui/GoldIcon'

interface Props {
  crop: Crop
  result: CompoundingResult
}

const ACTION_LABELS: Record<CompoundingResult['timeline'][number]['action'], string> = {
  'plant': 'Plant',
  'harvest+processing': 'Harvest → Process',
  'sell+replant': 'Sell + Replant',
  'final_sell': 'Final Sell',
}

const ACTION_COLORS: Record<CompoundingResult['timeline'][number]['action'], string> = {
  'plant': 'bg-blue-100 text-blue-700',
  'harvest+processing': 'bg-amber-100 text-amber-700',
  'sell+replant': 'bg-green-100 text-green-700',
  'final_sell': 'bg-purple-100 text-purple-700',
}

export function CompoundingDetail({ crop: _crop, result }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Compounding Reinvest</h3>

      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Reinvest Cycle</span><span>{result.reinvestCycleDays.toFixed(1)} days</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Peak Seeds</span><span className="font-medium">{result.peakSeeds}</span></div>
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-1">
          <span className="text-gray-500">Final Gold</span>
          <span className="flex items-center gap-1"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.finalGold)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500">Net Profit</span>
          <span className={`flex items-center gap-1 ${result.totalProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            <GoldIcon className="w-3.5 h-3.5" />{formatGold(result.totalProfit)}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500">Profit / Day</span>
          <span className="flex items-center gap-1"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.profitPerDay)}/day</span>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-700">Timeline</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Day</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Action</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Seeds</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Gold on Hand</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {result.timeline.map((snap, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-2 py-1.5">Day {snap.day}</td>
                <td className="px-2 py-1.5">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[snap.action]}`}>
                    {ACTION_LABELS[snap.action]}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right">{snap.seeds}</td>
                <td className="px-2 py-1.5 text-right">{formatGold(snap.goldOnHand)}</td>
                <td className={`px-2 py-1.5 text-right font-medium ${snap.cumulativeProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {formatGold(snap.cumulativeProfit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
