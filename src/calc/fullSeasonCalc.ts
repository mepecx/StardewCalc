import type { Crop, FullSeasonResult, HarvestEvent, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays, effectiveGrowDays, fertilizerCostPerTile, resolvePurchase, SEED_MAKER_EXPECTED_SEEDS, SEED_MAKER_CROPS_PER_DAY } from './professionModifier'

export function fullSeasonCalc(
  crop: Crop,
  settings: UserSettings,
  overrideSellMode?: UserSettings['sellMode'],
): FullSeasonResult | null {
  const { season, startDay, tilesPlanted, unlimitedMachines, machineCount, sellExcessRaw } = settings
  const sellMode = overrideSellMode ?? settings.sellMode
  const seasonEndDay = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28
  const useSeedMaker = settings.useSeedMaker && settings.mode === 'fullSeason'

  // First planting always purchased from shop (even with seed maker)
  const purchase = resolvePurchase(startDay, crop, settings)
  const plantDay = purchase.day
  const availableDays = seasonEndDay - plantDay + 1

  const growDays = effectiveGrowDays(crop, settings)

  if (plantDay + growDays > seasonEndDay) return null
  if (sellMode !== 'raw' && !crop.processing[sellMode]) return null

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const rawUnitPrice = sellMode !== 'raw' ? effectiveSellPrice(crop, settings, 'raw') : 0
  const processDays = getProcessDays(crop, sellMode)
  const tiles = Math.max(1, tilesPlanted)
  const yieldPerHarvest = (crop.baseYield + crop.extraYieldChance) * tiles

  // Machine slot tracking
  const useMachineCap = processDays > 0 && !unlimitedMachines
  const slots = useMachineCap ? Array(Math.max(1, machineCount)).fill(0) : []

  // Build planting cycles: each entry = one plant→harvest→ready cycle
  interface Cycle {
    plantDay?: number        // undefined for regrow harvests after first
    harvestDay: number
    seedCostPerTile: number  // 0 for regrow/seed maker
    isJojaFallback: boolean
    isSeedMakerReplant: boolean
  }

  const firstHarvestDay = plantDay + growDays
  if (firstHarvestDay > seasonEndDay) return null

  const cycles: Cycle[] = [{
    plantDay,
    harvestDay: firstHarvestDay,
    seedCostPerTile: purchase.seedCost,
    isJojaFallback: purchase.isJojaFallback,
    isSeedMakerReplant: false,
  }]

  if (crop.regrowDays > 0) {
    // Regrow crops: multiple harvests, no replanting
    let day = firstHarvestDay
    while (true) {
      const next = day + crop.regrowDays
      if (next > seasonEndDay) break
      cycles.push({ plantDay: undefined, harvestDay: next, seedCostPerTile: 0, isJojaFallback: false, isSeedMakerReplant: false })
      day = next
    }
  } else if (useSeedMaker) {
    // Non-regrow + seed maker: replant using seed maker after each harvest
    let day = firstHarvestDay
    while (true) {
      const readyDay = day + processDays
      const smPlantDay = readyDay
      const nextHarvest = smPlantDay + growDays
      if (nextHarvest > seasonEndDay) break
      cycles.push({ plantDay: smPlantDay, harvestDay: nextHarvest, seedCostPerTile: 0, isJojaFallback: false, isSeedMakerReplant: true })
      day = nextHarvest
    }
  } else {
    // Non-regrow, no seed maker: buy seeds from shop and replant each cycle
    let day = firstHarvestDay
    while (true) {
      const readyDay = day + processDays
      const nextPurchase = resolvePurchase(readyDay, crop, settings)
      const nextHarvest = nextPurchase.day + growDays
      if (nextHarvest > seasonEndDay) break
      cycles.push({ plantDay: nextPurchase.day, harvestDay: nextHarvest, seedCostPerTile: nextPurchase.seedCost, isJojaFallback: nextPurchase.isJojaFallback, isSeedMakerReplant: false })
      day = nextHarvest
    }
  }

  // Determine which harvests need seed maker diversion:
  // All harvests that are followed by a SM replanting need to divert crops.
  // The LAST harvest (and any regrow harvests) sell full yield.
  const replantingIndices = new Set<number>()
  if (useSeedMaker && crop.regrowDays === 0) {
    for (let i = 0; i < cycles.length - 1; i++) {
      if (cycles[i + 1].isSeedMakerReplant) {
        replantingIndices.add(i)
      }
    }
  }

  // Crops to divert per harvest to replant the same tile count
  const cropsToSeedMaker = replantingIndices.size > 0
    ? Math.min(Math.ceil(tiles / SEED_MAKER_EXPECTED_SEEDS), yieldPerHarvest)
    : 0

  const fertCost = fertilizerCostPerTile(settings) * tiles
  let cumulativeProfit = -fertCost  // fert paid once; seed costs deducted per cycle
  const harvestSchedule: HarvestEvent[] = []
  let batchesCompletedInSeason = 0
  let batchesSpillingOver = 0

  // Seed maker tracking
  let smTotalCropsDiverted = 0

  for (let hi = 0; hi < cycles.length; hi++) {
    const cycle = cycles[hi]
    const { harvestDay } = cycle
    const readyDay = harvestDay + processDays
    const completesInSeason = readyDay <= seasonEndDay
    if (completesInSeason) batchesCompletedInSeason++
    else batchesSpillingOver++

    const isDivertingThisHarvest = replantingIndices.has(hi)
    const divertedThisHarvest = isDivertingThisHarvest ? cropsToSeedMaker : 0
    const sellableYield = yieldPerHarvest - divertedThisHarvest

    let processedYield: number
    let excessYield: number

    if (!completesInSeason) {
      // Processing finishes after season — no time pressure, all crops get processed
      processedYield = sellableYield
      excessYield = 0
    } else if (!useMachineCap) {
      processedYield = sellableYield
      excessYield = 0
    } else {
      const freeIndices: number[] = []
      for (let i = 0; i < slots.length; i++) {
        if (slots[i] <= harvestDay) freeIndices.push(i)
      }
      const freeCount = freeIndices.length
      processedYield = Math.min(sellableYield, freeCount)
      excessYield = sellableYield - processedYield

      const toOccupy = Math.min(Math.ceil(processedYield), freeCount)
      for (let k = 0; k < toOccupy; k++) {
        slots[freeIndices[k]] = readyDay
      }
    }

    const excessRevenue = sellExcessRaw ? excessYield * rawUnitPrice : 0
    const batchRevenue = processedYield * unitPrice + excessRevenue
    const seedCost = cycle.seedCostPerTile * tiles
    cumulativeProfit += batchRevenue - seedCost

    if (isDivertingThisHarvest) {
      smTotalCropsDiverted += divertedThisHarvest
    }

    harvestSchedule.push({
      plantDay: cycle.plantDay,
      harvestDay,
      readyDay,
      yieldAmount: yieldPerHarvest,
      processedYield,
      excessYield,
      excessRevenue,
      batchRevenue,
      cumulativeProfit,
      seedCost,
      isJojaFallback: cycle.isJojaFallback || undefined,
      cropsDivertedToSeedMaker: isDivertingThisHarvest ? divertedThisHarvest : undefined,
      isSeedMakerReplant: cycle.isSeedMakerReplant || undefined,
    })
  }

  const totalHarvests = cycles.length
  const totalSeedCost = harvestSchedule.reduce((s, e) => s + e.seedCost, 0)
  const totalRevenue = harvestSchedule.reduce((s, e) => s + e.batchRevenue, 0)
  const totalProfit = totalRevenue - totalSeedCost - fertCost
  const profitPerDay = availableDays > 0 ? totalProfit / availableDays : 0
  const totalYield = harvestSchedule.reduce((s, e) => s + e.processedYield, 0)

  const notes: string[] = []
  if (batchesSpillingOver > 0) {
    notes.push(`${batchesSpillingOver} harvest${batchesSpillingOver > 1 ? 's' : ''} processed after season ends`)
  }
  if (useMachineCap && harvestSchedule.some(e => e.excessYield > 0)) {
    const excessNote = sellExcessRaw
      ? 'Excess crops sold raw (machine cap reached)'
      : 'Excess crops discarded (machine cap reached; enable "Sell Excess Raw" to recover value)'
    notes.push(excessNote)
  }
  const processingNote = notes.length > 0 ? notes.join(' · ') : undefined

  const smSeedsProduced = Math.floor(smTotalCropsDiverted * SEED_MAKER_EXPECTED_SEEDS)

  return {
    cropId: crop.id,
    sellMode,
    totalProfit,
    profitPerDay,
    totalHarvests,
    totalYield,
    harvestSchedule,
    daysUsed: cycles[cycles.length - 1].harvestDay,
    seedsPlanted: tiles,
    batchesCompletedInSeason,
    batchesSpillingOver,
    processingNote,
    seedMakerInfo: smTotalCropsDiverted > 0 ? {
      cropsDiverted: smTotalCropsDiverted,
      seedsProduced: smSeedsProduced,
      peakCropsDivertedPerDay: cropsToSeedMaker,
      recommendedMachines: Math.ceil(cropsToSeedMaker / SEED_MAKER_CROPS_PER_DAY),
    } : undefined,
  }
}
