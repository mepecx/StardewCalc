import type { Crop, FullSeasonResult, HarvestEvent, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays, effectiveGrowDays, fertilizerCostPerTile } from './professionModifier'

export function fullSeasonCalc(
  crop: Crop,
  settings: UserSettings,
  overrideSellMode?: UserSettings['sellMode'],
): FullSeasonResult | null {
  const { season, startDay, tilesPlanted, unlimitedMachines, machineCount, sellExcessRaw } = settings
  const sellMode = overrideSellMode ?? settings.sellMode
  const seasonEndDay = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28
  const availableDays = seasonEndDay - startDay + 1

  const growDays = effectiveGrowDays(crop, settings)

  if (startDay + growDays > seasonEndDay) return null
  if (sellMode !== 'raw' && !crop.processing[sellMode]) return null

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const rawUnitPrice = sellMode !== 'raw' ? effectiveSellPrice(crop, settings, 'raw') : 0
  const processDays = getProcessDays(crop, sellMode)
  const tiles = Math.max(1, tilesPlanted)
  const yieldPerHarvest = (crop.baseYield + crop.extraYieldChance) * tiles

  // Machine slot tracking: each slot stores the season-day it becomes free.
  // Only active when processing (processDays > 0) and machine cap is enabled.
  const useMachineCap = processDays > 0 && !unlimitedMachines
  const slots = useMachineCap ? Array(Math.max(1, machineCount)).fill(0) : []

  // Build harvest schedule
  const harvestDays: number[] = []
  const firstHarvestDay = startDay + growDays
  if (firstHarvestDay > seasonEndDay) return null

  harvestDays.push(firstHarvestDay)
  if (crop.regrowDays > 0) {
    let day = firstHarvestDay
    while (true) {
      const next = day + crop.regrowDays
      if (next > seasonEndDay) break
      harvestDays.push(next)
      day = next
    }
  }

  const fertCost = fertilizerCostPerTile(settings) * tiles
  let cumulativeProfit = -(crop.seedCost * tiles) - fertCost
  const harvestSchedule: HarvestEvent[] = []
  let batchesCompletedInSeason = 0
  let batchesSpillingOver = 0

  for (const harvestDay of harvestDays) {
    const readyDay = harvestDay + processDays
    const completesInSeason = readyDay <= seasonEndDay
    if (completesInSeason) batchesCompletedInSeason++
    else batchesSpillingOver++

    let processedYield: number
    let excessYield: number

    if (!completesInSeason) {
      // Batch spills over — nothing is sold, no machine slots consumed
      processedYield = 0
      excessYield = yieldPerHarvest
    } else if (!useMachineCap) {
      // Unlimited machines or raw sale
      processedYield = yieldPerHarvest
      excessYield = 0
    } else {
      // Count free slots at harvestDay
      const freeIndices: number[] = []
      for (let i = 0; i < slots.length; i++) {
        if (slots[i] <= harvestDay) freeIndices.push(i)
      }
      const freeCount = freeIndices.length
      processedYield = Math.min(yieldPerHarvest, freeCount)
      excessYield = yieldPerHarvest - processedYield

      // Mark the assigned slots as busy until readyDay
      const toOccupy = Math.min(Math.ceil(processedYield), freeCount)
      for (let k = 0; k < toOccupy; k++) {
        slots[freeIndices[k]] = readyDay
      }
    }

    const excessRevenue = sellExcessRaw ? excessYield * rawUnitPrice : 0
    const batchRevenue = processedYield * unitPrice + excessRevenue
    cumulativeProfit += batchRevenue

    harvestSchedule.push({
      harvestDay,
      readyDay,
      yieldAmount: yieldPerHarvest,
      processedYield,
      excessYield,
      excessRevenue,
      batchRevenue,
      cumulativeProfit,
    })
  }

  const totalHarvests = harvestDays.length
  const totalSeedCost = crop.seedCost * tiles
  const totalRevenue = harvestSchedule.reduce((s, e) => s + e.batchRevenue, 0)
  const totalProfit = totalRevenue - totalSeedCost - fertCost
  const profitPerDay = availableDays > 0 ? totalProfit / availableDays : 0
  const totalYield = harvestSchedule.reduce((s, e) => s + e.processedYield, 0)

  const notes: string[] = []
  if (batchesSpillingOver > 0) {
    notes.push(`${batchesSpillingOver} harvest${batchesSpillingOver > 1 ? 's' : ''} not ready before season ends (excluded from profit)`)
  }
  if (useMachineCap && harvestSchedule.some(e => e.excessYield > 0)) {
    const excessNote = sellExcessRaw
      ? 'Excess crops sold raw (machine cap reached)'
      : 'Excess crops discarded (machine cap reached; enable "Sell Excess Raw" to recover value)'
    notes.push(excessNote)
  }
  const processingNote = notes.length > 0 ? notes.join(' · ') : undefined

  return {
    cropId: crop.id,
    sellMode,
    totalProfit,
    profitPerDay,
    totalHarvests,
    totalYield,
    harvestSchedule,
    daysUsed: harvestDays[harvestDays.length - 1],
    seedsPlanted: tiles,
    batchesCompletedInSeason,
    batchesSpillingOver,
    processingNote,
  }
}
