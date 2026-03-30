import type { Crop, SellMode } from '../types'
import type { UserSettings } from '../types'
import { getAverageQualityMultiplier } from './qualityModifier'

export const TILLER_MULTIPLIER = 1.10
export const ARTISAN_MULTIPLIER = 1.40

/**
 * Returns the effective sell price per unit for a crop in a given sell mode,
 * accounting for professions and optional quality distribution.
 */
export function effectiveSellPrice(
  crop: Crop,
  settings: UserSettings,
  sellMode: SellMode,
): number {
  if (sellMode === 'raw') {
    const qualityMult = settings.qualityEnabled
      ? getAverageQualityMultiplier(settings.farmingLevel)
      : 1.0
    const basePrice = crop.sellPrice * qualityMult
    return settings.tillerProfession ? basePrice * TILLER_MULTIPLIER : basePrice
  }

  const variant = crop.processing[sellMode]
  if (!variant) return 0  // crop doesn't support this processor

  const basePrice = variant.sellPrice
  return settings.artisanProfession ? basePrice * ARTISAN_MULTIPLIER : basePrice
}

/**
 * Returns processing time in whole days for the selected sell mode, 0 for raw.
 * Always rounds UP to the nearest integer (a 2.8-day process takes 3 full days).
 */
export function getProcessDays(crop: Crop, sellMode: SellMode): number {
  if (sellMode === 'raw') return 0
  const raw = crop.processing[sellMode]?.processDays ?? 0
  return raw > 0 ? Math.ceil(raw) : 0
}

/**
 * Returns effective grow days after applying fertilizer speed reduction.
 * Only affects initial growDays — regrowDays are never reduced by fertilizer.
 */
export function effectiveGrowDays(crop: Crop, settings: UserSettings): number {
  const mult = settings.fertilizer === 'speedGro' ? 0.9
    : settings.fertilizer === 'deluxeSpeedGro' ? 0.75
    : 1.0
  return Math.max(1, Math.floor(crop.growDays * mult))
}

/**
 * Returns the per-tile cost of fertilizer given settings.
 * Speed-Gro: Pierre 100g
 * Deluxe Speed-Gro: Pierre 150g, Sandy 80g
 */
export function fertilizerCostPerTile(settings: UserSettings): number {
  if (!settings.payForFertilizer || settings.fertilizer === 'none') return 0
  if (settings.fertilizer === 'speedGro') return 100 // Pierre only
  // deluxeSpeedGro
  return settings.fertilizerSource === 'sandy' ? 80 : 150
}

/**
 * Returns the output name for the selected sell mode.
 */
export function getOutputName(crop: Crop, sellMode: SellMode): string {
  if (sellMode === 'raw') return crop.name
  return crop.processing[sellMode]?.output ?? crop.name
}
