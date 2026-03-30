import type { Crop, FullSeasonResult, HarvestEvent, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays } from './professionModifier'

export function fullSeasonCalc(
  crop: Crop,
  settings: UserSettings,
  overrideSellMode?: UserSettings['sellMode'],
): FullSeasonResult | null {
  const { season } = settings
  const sellMode = overrideSellMode ?? settings.sellMode
  const seasonDays = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28

  if (crop.growDays > seasonDays) return null

  if (sellMode !== 'raw' && !crop.processing[sellMode]) return null

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const processDays = getProcessDays(crop, sellMode)
  const yieldPerHarvest = crop.baseYield + crop.extraYieldChance

  // Build harvest schedule
  const harvestDays: number[] = []
  const firstHarvestDay = crop.growDays
  harvestDays.push(firstHarvestDay)

  if (crop.regrowDays > 0) {
    let day = firstHarvestDay
    while (day + crop.regrowDays <= seasonDays) {
      day += crop.regrowDays
      harvestDays.push(day)
    }
  }

  let cumulativeProfit = -crop.seedCost
  const harvestSchedule: HarvestEvent[] = harvestDays.map(harvestDay => {
    const readyDay = harvestDay + processDays
    const batchRevenue = unitPrice * yieldPerHarvest
    cumulativeProfit += batchRevenue
    return { harvestDay, readyDay, yieldAmount: yieldPerHarvest, batchRevenue, cumulativeProfit }
  })

  const totalHarvests = harvestDays.length
  const totalYield = yieldPerHarvest * totalHarvests
  const totalRevenue = unitPrice * totalYield
  const totalProfit = totalRevenue - crop.seedCost
  const profitPerDay = totalProfit / seasonDays
  const batchesCompletedInSeason = harvestSchedule.filter(e => e.readyDay <= seasonDays).length
  const batchesSpillingOver = harvestSchedule.length - batchesCompletedInSeason

  const processingNote = batchesSpillingOver > 0
    ? `${batchesSpillingOver} batch${batchesSpillingOver > 1 ? 'es' : ''} finish after season end`
    : undefined

  return {
    cropId: crop.id,
    sellMode,
    totalProfit,
    profitPerDay,
    totalHarvests,
    totalYield,
    harvestSchedule,
    daysUsed: harvestDays[harvestDays.length - 1],
    seedsPlanted: 1,
    batchesCompletedInSeason,
    batchesSpillingOver,
    processingNote,
  }
}
