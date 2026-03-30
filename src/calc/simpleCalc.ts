import type { Crop, SimpleResult, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays, effectiveGrowDays, fertilizerCostPerTile } from './professionModifier'

export function simpleCalc(crop: Crop, settings: UserSettings): SimpleResult | null {
  const { season, sellMode, startDay, tilesPlanted, unlimitedMachines, machineCount, sellExcessRaw } = settings
  const seasonDays = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28
  const maxGrowDays = seasonDays - startDay
  const growDays = effectiveGrowDays(crop, settings)

  if (growDays > maxGrowDays) return null

  if (sellMode !== 'raw' && !crop.processing[sellMode]) return null

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const rawUnitPrice = sellMode !== 'raw' ? effectiveSellPrice(crop, settings, 'raw') : 0
  const processDays = getProcessDays(crop, sellMode)
  const effectiveDays = growDays + processDays

  if (effectiveDays > maxGrowDays) return null

  const tiles = Math.max(1, tilesPlanted)
  const yieldPerTile = crop.baseYield + crop.extraYieldChance
  const totalYield = yieldPerTile * tiles

  // Machine cap: for simple mode, one harvest event
  const useMachineCap = processDays > 0 && !unlimitedMachines
  const machineCapacity = useMachineCap ? Math.max(1, machineCount) : Infinity
  const processedYield = Math.min(totalYield, machineCapacity)
  const excessYield = totalYield - processedYield
  const excessRevenue = sellExcessRaw ? excessYield * rawUnitPrice : 0

  const revenue = processedYield * unitPrice + excessRevenue
  const totalSeedCost = crop.seedCost * tiles
  const totalFertCost = fertilizerCostPerTile(settings) * tiles
  const profit = revenue - totalSeedCost - totalFertCost
  const profitPerDay = effectiveDays > 0 ? profit / effectiveDays : 0

  return {
    cropId: crop.id,
    sellMode,
    revenue,
    seedCost: totalSeedCost,
    effectiveDays,
    totalProfit: profit,
    profitPerDay,
    totalHarvests: 1,
    totalYield: processedYield,
  }
}
