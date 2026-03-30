import type { Crop, CompoundingResult, CompoundingSnapshot, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays } from './professionModifier'

export function compoundingCalc(crop: Crop, settings: UserSettings): CompoundingResult | null {
  const { season, startingGold, sellMode } = settings
  const seasonDays = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28

  if (crop.growDays > seasonDays) return null
  if (sellMode !== 'raw' && !crop.processing[sellMode]) return null
  if (startingGold < crop.seedCost) return null

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const processDays = getProcessDays(crop, sellMode)
  const yieldPerSeed = crop.baseYield + crop.extraYieldChance

  const timeline: CompoundingSnapshot[] = []
  let gold = startingGold
  let seeds = Math.floor(gold / crop.seedCost)
  gold -= seeds * crop.seedCost

  let cumulativeProfit = -(seeds * crop.seedCost)
  let peakSeeds = seeds
  let currentDay = 0

  timeline.push({ day: 0, seeds, goldOnHand: gold, cumulativeProfit, action: 'plant' })

  // Track whether this is the first harvest (uses growDays) or subsequent (uses regrowDays)
  let nextCycleLength = crop.growDays

  while (true) {
    const harvestDay = currentDay + nextCycleLength
    if (harvestDay > seasonDays) break

    const readyDay = harvestDay + processDays

    // Record that harvest starts (machine begins processing)
    timeline.push({
      day: harvestDay,
      seeds,
      goldOnHand: gold,
      cumulativeProfit,
      action: 'harvest+processing',
    })

    const batchRevenue = seeds * yieldPerSeed * unitPrice
    gold += batchRevenue
    cumulativeProfit += batchRevenue

    // Check if another grow cycle fits after this readyDay
    const nextGrowLength = crop.regrowDays > 0 ? crop.regrowDays : crop.growDays
    const canReplant = readyDay + nextGrowLength <= seasonDays

    if (!canReplant) {
      timeline.push({
        day: readyDay,
        seeds,
        goldOnHand: gold,
        cumulativeProfit,
        action: 'final_sell',
      })
      break
    }

    // Reinvest: buy more seeds
    const additionalSeeds = Math.floor(gold / crop.seedCost)
    if (additionalSeeds > 0) {
      gold -= additionalSeeds * crop.seedCost
      seeds += additionalSeeds
      cumulativeProfit -= additionalSeeds * crop.seedCost
    }
    if (seeds > peakSeeds) peakSeeds = seeds

    timeline.push({
      day: readyDay,
      seeds,
      goldOnHand: gold,
      cumulativeProfit,
      action: 'sell+replant',
    })

    currentDay = readyDay
    nextCycleLength = crop.regrowDays > 0 ? crop.regrowDays : crop.growDays
  }

  const reinvestCycleDays =
    (crop.regrowDays > 0 ? crop.regrowDays : crop.growDays) + processDays

  const totalProfit = gold - startingGold
  const profitPerDay = totalProfit / seasonDays

  return {
    cropId: crop.id,
    sellMode,
    totalProfit,
    profitPerDay,
    totalHarvests: timeline.filter(s => s.action === 'harvest+processing').length,
    totalYield:
      timeline
        .filter(s => s.action === 'harvest+processing')
        .reduce((sum, s) => sum + s.seeds * yieldPerSeed, 0),
    timeline,
    finalGold: gold,
    peakSeeds,
    reinvestCycleDays,
  }
}
