import type { Crop, SimpleResult, UserSettings } from '../types'
import { effectiveSellPrice, getProcessDays } from './professionModifier'

export function simpleCalc(crop: Crop, settings: UserSettings): SimpleResult | null {
  const { season, sellMode } = settings
  const seasonDays = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28

  if (crop.growDays > seasonDays) return null

  // For raw sellMode or when the crop supports the processor
  if (sellMode !== 'raw' && !crop.processing[sellMode]) {
    // Return a null-ish result so the table can show "N/A"
    return null
  }

  const unitPrice = effectiveSellPrice(crop, settings, sellMode)
  if (unitPrice === 0) return null

  const expectedYield = crop.baseYield + crop.extraYieldChance
  const revenue = unitPrice * expectedYield
  const processDays = getProcessDays(crop, sellMode)
  const effectiveDays = crop.growDays + processDays
  const profit = revenue - crop.seedCost
  const profitPerDay = effectiveDays > 0 ? profit / effectiveDays : 0

  return {
    cropId: crop.id,
    sellMode,
    revenue,
    seedCost: crop.seedCost,
    effectiveDays,
    totalProfit: profit,
    profitPerDay,
    totalHarvests: 1,
    totalYield: expectedYield,
  }
}
