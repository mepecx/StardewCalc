import type { Crop, FullSeasonResult } from '../../types'
import { GoldIcon, formatGold } from '../ui/GoldIcon'

interface Props {
  crop: Crop
  result: FullSeasonResult
}

export function FullSeasonDetail({ crop: _crop, result }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Full Season Breakdown</h3>

      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Total Harvests</span><span className="font-medium">{result.totalHarvests}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Total Yield</span><span className="font-medium">{result.totalYield.toFixed(1)}</span></div>
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-1">
          <span className="text-gray-500">Net Profit</span>
          <span className="flex items-center gap-1"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.totalProfit)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500">Profit / Day</span>
          <span className="flex items-center gap-1"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.profitPerDay)}/day</span>
        </div>
        {result.processingNote && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-1">
            {result.processingNote}
          </p>
        )}
      </div>

      <h4 className="text-sm font-semibold text-gray-700">Harvest Schedule</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Harvest Day</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Ready Day</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Yield</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Batch Revenue</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {result.harvestSchedule.map((evt, i) => {
              const spills = evt.readyDay > 28
              return (
                <tr key={i} className={`border-t border-gray-100 ${spills ? 'bg-amber-50' : ''}`}>
                  <td className="px-2 py-1.5">Day {evt.harvestDay}</td>
                  <td className="px-2 py-1.5">
                    Day {Math.round(evt.readyDay)}
                    {spills && <span className="ml-1 text-amber-600 text-xs">*</span>}
                  </td>
                  <td className="px-2 py-1.5 text-right">{evt.yieldAmount.toFixed(1)}</td>
                  <td className="px-2 py-1.5 text-right">{formatGold(evt.batchRevenue)}</td>
                  <td className={`px-2 py-1.5 text-right font-medium ${evt.cumulativeProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {formatGold(evt.cumulativeProfit)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {result.batchesSpillingOver > 0 && (
          <p className="text-xs text-amber-600 mt-1">
            * {result.batchesSpillingOver} batch{result.batchesSpillingOver > 1 ? 'es' : ''} finish after season end
          </p>
        )}
      </div>
    </div>
  )
}
