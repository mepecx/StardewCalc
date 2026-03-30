import type { Crop, CompoundingResult, CompoundingSnapshot, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays, effectiveGrowDays, fertilizerCostPerTile } from './professionModifier'

/** One planted batch with its own harvest schedule */
interface CropBatch {
  id: number
  tiles: number
  nextHarvestDay: number
  isFirstGrow: boolean
}

export function compoundingCalc(crop: Crop, settings: UserSettings): CompoundingResult | null {
  const {
    season, startingGold, sellMode, startDay, maxSeeds, unlimitedMaxSeeds,
    unlimitedMachines, machineCount, sellExcessRaw,
  } = settings
  const seasonEndDay = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28

  if (sellMode !== 'raw' && !crop.processing[sellMode]) return null

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const rawUnitPrice = sellMode !== 'raw' ? effectiveSellPrice(crop, settings, 'raw') : 0
  const processDays = getProcessDays(crop, sellMode)
  const yieldPerSeed = crop.baseYield + crop.extraYieldChance
  const firstGrowDays = effectiveGrowDays(crop, settings)

  const effectiveMaxSeeds = unlimitedMaxSeeds ? Infinity : Math.max(1, maxSeeds)
  const machineCapacity = (processDays > 0 && !unlimitedMachines) ? Math.max(1, machineCount) : Infinity
  const fertCost = fertilizerCostPerTile(settings)
  const costPerSeed = crop.seedCost + fertCost

  const timeline: CompoundingSnapshot[] = []
  let gold = startingGold
  let totalTiles = Math.min(Math.floor(gold / costPerSeed), effectiveMaxSeeds)
  if (totalTiles === 0) return null

  gold -= totalTiles * costPerSeed
  let cumulativeProfit = -(totalTiles * costPerSeed)
  let peakSeeds = totalTiles
  let nextBatchId = 0

  const batches: CropBatch[] = [{
    id: nextBatchId++,
    tiles: totalTiles,
    nextHarvestDay: startDay + firstGrowDays,
    isFirstGrow: true,
  }]

  timeline.push({ day: startDay, seeds: totalTiles, goldOnHand: gold, cumulativeProfit, action: 'plant' })

  const MAX_ITERATIONS = 500
  let iterations = 0

  while (iterations++ < MAX_ITERATIONS) {
    // Find earliest harvest day across all active batches
    const activeBatches = batches.filter(b => b.nextHarvestDay <= seasonEndDay)
    if (activeBatches.length === 0) break

    const minHarvestDay = Math.min(...activeBatches.map(b => b.nextHarvestDay))
    if (minHarvestDay > seasonEndDay) break

    const harvestingToday = batches.filter(b => b.nextHarvestDay === minHarvestDay)
    const harvestDay = minHarvestDay
    const readyDay = harvestDay + processDays

    // Emit a separate timeline row per batch harvesting today
    let dayTotalYield = 0
    for (const batch of harvestingToday) {
      const batchYield = batch.tiles * yieldPerSeed
      dayTotalYield += batchYield

      timeline.push({
        day: harvestDay,
        seeds: totalTiles,
        goldOnHand: gold,
        cumulativeProfit,
        action: batch.isFirstGrow ? 'harvest+processing' : 'regrow',
        batchId: batch.id,
        batchTiles: batch.tiles,
      })

      // Advance batch to next regrow (or mark done for non-regrow)
      batch.isFirstGrow = false
      if (crop.regrowDays > 0) {
        batch.nextHarvestDay = harvestDay + crop.regrowDays
      } else {
        batch.nextHarvestDay = Infinity // non-regrow: tile freed after harvest
        totalTiles -= batch.tiles
      }
    }

    // Processing spills over — no revenue, done
    if (readyDay > seasonEndDay) break

    // Apply machine cap to combined day yield
    const processedYield = Math.min(dayTotalYield, machineCapacity)
    const excessYield = dayTotalYield - processedYield
    const excessRevenue = sellExcessRaw ? excessYield * rawUnitPrice : 0

    if (excessRevenue > 0) {
      gold += excessRevenue
      cumulativeProfit += excessRevenue
    }

    const processedRevenue = processedYield * unitPrice
    gold += processedRevenue
    cumulativeProfit += processedRevenue

    // Check if any batch can still produce
    const remainingActive = batches.filter(b => b.nextHarvestDay <= seasonEndDay)
    const nextEarliestHarvest = remainingActive.length > 0
      ? Math.min(...remainingActive.map(b => b.nextHarvestDay))
      : Infinity

    // Reinvest: can we plant a new batch that harvests in time?
    const newBatchFirstHarvestDay = readyDay + firstGrowDays
    const canPlantNewBatch = newBatchFirstHarvestDay <= seasonEndDay
    const affordableNewSeeds = Math.floor(gold / costPerSeed)
    const canBuyNewSeeds = affordableNewSeeds > 0 && totalTiles < effectiveMaxSeeds

    if (canPlantNewBatch && canBuyNewSeeds) {
      const newSeeds = Math.min(affordableNewSeeds, effectiveMaxSeeds - totalTiles)
      gold -= newSeeds * costPerSeed
      cumulativeProfit -= newSeeds * costPerSeed
      totalTiles += newSeeds
      if (totalTiles > peakSeeds) peakSeeds = totalTiles

      batches.push({
        id: nextBatchId++,
        tiles: newSeeds,
        nextHarvestDay: readyDay + firstGrowDays,
        isFirstGrow: true,
      })

      timeline.push({
        day: readyDay,
        seeds: totalTiles,
        goldOnHand: gold,
        cumulativeProfit,
        action: 'sell+replant',
        excessYield: excessYield > 0 ? excessYield : undefined,
        excessRevenue: excessRevenue > 0 ? excessRevenue : undefined,
      })
    } else if (nextEarliestHarvest <= seasonEndDay) {
      // More harvests coming but no new seeds purchased
      timeline.push({
        day: readyDay,
        seeds: totalTiles,
        goldOnHand: gold,
        cumulativeProfit,
        action: 'sell',
        excessYield: excessYield > 0 ? excessYield : undefined,
        excessRevenue: excessRevenue > 0 ? excessRevenue : undefined,
      })
    } else {
      timeline.push({
        day: readyDay,
        seeds: totalTiles,
        goldOnHand: gold,
        cumulativeProfit,
        action: 'final_sell',
        excessYield: excessYield > 0 ? excessYield : undefined,
        excessRevenue: excessRevenue > 0 ? excessRevenue : undefined,
      })
      break
    }
  }

  const availableDays = seasonEndDay - startDay + 1
  const totalProfit = gold - startingGold
  const profitPerDay = availableDays > 0 ? totalProfit / availableDays : 0

  const reinvestCycleDays = (crop.regrowDays > 0 ? crop.regrowDays : firstGrowDays) + processDays

  const harvestSnapshots = timeline.filter(s => s.action === 'harvest+processing' || s.action === 'regrow')
  const totalHarvests = harvestSnapshots.length

  let totalYield = 0
  for (const snap of harvestSnapshots) {
    totalYield += (snap.batchTiles ?? 0) * yieldPerSeed
  }

  return {
    cropId: crop.id,
    sellMode,
    totalProfit,
    profitPerDay,
    totalHarvests,
    totalYield,
    timeline,
    finalGold: gold,
    peakSeeds,
    reinvestCycleDays,
  }
}
