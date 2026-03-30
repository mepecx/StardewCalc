import type { Crop, ProcessingResult } from '../../types'
import { GoldIcon, formatGold } from '../ui/GoldIcon'

interface Props {
  crop: Crop
  result: ProcessingResult
}

const MODE_LABELS: Record<string, string> = {
  raw: 'Raw',
  preservesJar: 'Preserves Jar',
  keg: 'Keg',
  dehydrator: 'Dehydrator',
  oilMaker: 'Oil Maker',
}

export function ProcessingDetail({ crop: _crop, result }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Processing Comparison</h3>

      <div className="space-y-2">
        {result.variants.map((v, i) => {
          const isBest = v.sellMode === result.bestSellMode
          return (
            <div
              key={v.sellMode}
              className={`rounded-lg border p-3 text-sm ${
                isBest ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {isBest && <span className="text-green-600 mr-1">★</span>}
                  {MODE_LABELS[v.sellMode]}
                </span>
                <span className="text-xs text-gray-400">
                  #{i + 1}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-2">{v.outputName}</div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="text-gray-500">Sell Price</div>
                <div className="text-right flex items-center justify-end gap-1">
                  <GoldIcon className="w-3 h-3" />{formatGold(v.sellPrice)}
                </div>
                <div className="text-gray-500">Total Profit</div>
                <div className={`text-right flex items-center justify-end gap-1 font-medium ${v.totalProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  <GoldIcon className="w-3 h-3" />{formatGold(v.totalProfit)}
                </div>
                <div className="text-gray-500">Profit / Day</div>
                <div className="text-right flex items-center justify-end gap-1 font-semibold">
                  <GoldIcon className="w-3 h-3" />{formatGold(v.profitPerDay)}/day
                </div>
              </div>

              {v.processingBottleneck && (
                <p className={`mt-2 text-xs rounded px-2 py-1 ${
                  v.processingBottleneck.startsWith('Single')
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {v.processingBottleneck}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
