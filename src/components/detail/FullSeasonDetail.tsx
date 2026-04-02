import type { Crop, FullSeasonResult } from '../../types'
import { GoldIcon, formatGold, formatDay } from '../ui/GoldIcon'
import { useSettingsContext } from '../../context/SettingsContext'

interface Props {
  crop: Crop
  result: FullSeasonResult
}

export function FullSeasonDetail({ crop: _crop, result }: Props) {
  const { settings } = useSettingsContext()
  const seasonEndDay = settings.season === 'greenhouse'
    ? settings.greenhouseSeasons * 28
    : 28

  const hasExcess = result.harvestSchedule.some(e => e.excessYield > 0)
  const hasSeedMaker = result.harvestSchedule.some(e => e.cropsDivertedToSeedMaker != null)
  const hasProcessing = result.harvestSchedule.some(e => e.readyDay !== e.harvestDay)

  const breakEvenEvent = result.harvestSchedule.find(e => e.cumulativeProfit >= 0)
  const breakEvenDay = breakEvenEvent?.readyDay ?? null

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Full Season Breakdown</h3>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Total Harvests</span><span className="font-medium dark:text-gray-200">{result.totalHarvests}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Counted Harvests</span><span className="font-medium dark:text-gray-200">{result.batchesCompletedInSeason}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Total Yield</span><span className="font-medium dark:text-gray-200">{result.totalYield.toFixed(1)}</span></div>
        {result.seedMakerInfo && (
          <>
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Crops to Seed Maker</span><span className="dark:text-gray-200">{result.seedMakerInfo.cropsDiverted}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Seeds Produced</span><span className="dark:text-gray-200">{result.seedMakerInfo.seedsProduced}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Seed Makers Needed</span><span className="font-medium dark:text-gray-200">{result.seedMakerInfo.recommendedMachines}</span></div>
          </>
        )}
        <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-600 pt-2 mt-1">
          <span className="text-gray-500 dark:text-gray-400">Net Profit</span>
          <span className="flex items-center gap-1 dark:text-gray-100"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.totalProfit)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500 dark:text-gray-400">Profit / Day</span>
          <span className="flex items-center gap-1 dark:text-gray-100"><GoldIcon className="w-3.5 h-3.5" />{formatGold(result.profitPerDay)}/day</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-500 dark:text-gray-400">Break-even</span>
          {breakEvenDay !== null
            ? <span className="text-green-700 dark:text-green-400">{formatDay(breakEvenDay, settings.season)}</span>
            : <span className="text-red-600 dark:text-red-400">Never</span>
          }
        </div>
        {result.processingNote && (
          <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded px-2 py-1 mt-1">
            {result.processingNote}
          </p>
        )}
      </div>

      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Harvest Schedule</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-600 dark:text-gray-400">Plant</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-600 dark:text-gray-400">Harvest</th>
              {hasProcessing && (
                <th className="px-2 py-1.5 text-left font-semibold text-gray-600 dark:text-gray-400">Ready</th>
              )}
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600 dark:text-gray-400">Yield</th>
              {hasSeedMaker && (
                <th className="px-2 py-1.5 text-right font-semibold text-gray-600 dark:text-gray-400">SM</th>
              )}
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600 dark:text-gray-400">Seeds</th>
              {hasExcess && (
                <th className="px-2 py-1.5 text-right font-semibold text-gray-600 dark:text-gray-400">Excess</th>
              )}
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600 dark:text-gray-400">Revenue</th>
              <th className="px-2 py-1.5 text-right font-semibold text-gray-600 dark:text-gray-400">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {result.harvestSchedule.map((evt, i) => {
              const spills = evt.readyDay > seasonEndDay
              return (
                <tr key={i} className={`border-t border-gray-100 dark:border-gray-700 ${spills ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  <td className="px-2 py-1.5 dark:text-gray-300">
                    {evt.plantDay != null ? (
                      <>
                        {formatDay(evt.plantDay, settings.season)}
                        {evt.isJojaFallback && (
                          <span className="ml-1 text-blue-500 dark:text-blue-400 text-[10px] font-semibold">Joja</span>
                        )}
                        {evt.isSeedMakerReplant && (
                          <span className="ml-1 text-teal-600 dark:text-teal-400 text-[10px] font-semibold">SM</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 dark:text-gray-300">{formatDay(evt.harvestDay, settings.season)}</td>
                  {hasProcessing && (
                    <td className={`px-2 py-1.5 ${spills ? 'text-amber-600 dark:text-amber-400' : 'dark:text-gray-300'}`}>
                      {formatDay(evt.readyDay, settings.season)}
                      {spills && <span className="ml-1 text-[10px] font-semibold">*</span>}
                    </td>
                  )}
                  <td className="px-2 py-1.5 text-right dark:text-gray-300">{evt.processedYield.toFixed(1)}</td>
                  {hasSeedMaker && (
                    <td className="px-2 py-1.5 text-right">
                      {evt.cropsDivertedToSeedMaker != null
                        ? <span className="text-teal-600 dark:text-teal-400">{evt.cropsDivertedToSeedMaker}</span>
                        : <span className="text-gray-300 dark:text-gray-600">—</span>
                      }
                    </td>
                  )}
                  <td className="px-2 py-1.5 text-right">
                    {evt.seedCost > 0
                      ? <span className="text-red-600 dark:text-red-400">-{formatGold(evt.seedCost)}</span>
                      : <span className="text-gray-300 dark:text-gray-600">—</span>
                    }
                  </td>
                  {hasExcess && (
                    <td className="px-2 py-1.5 text-right">
                      {evt.excessYield > 0
                        ? <span className="text-orange-600 dark:text-orange-400">{evt.excessYield.toFixed(1)}</span>
                        : <span className="text-gray-300 dark:text-gray-600">—</span>
                      }
                    </td>
                  )}
                  <td className="px-2 py-1.5 text-right dark:text-gray-300">
                    {formatGold(evt.batchRevenue)}
                  </td>
                  <td className={`px-2 py-1.5 text-right font-medium ${evt.cumulativeProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatGold(evt.cumulativeProfit)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {result.batchesSpillingOver > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            * Processing finishes after the season — sold {settings.season === 'greenhouse' ? 'later' : 'next season'}
          </p>
        )}
        {hasExcess && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            Excess = crops not processed due to machine cap
            {settings.sellExcessRaw ? ' (sold raw)' : ' (discarded)'}
          </p>
        )}
      </div>
    </div>
  )
}
