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
 * Returns processing time in days for the selected sell mode, 0 for raw.
 */
export function getProcessDays(crop: Crop, sellMode: SellMode): number {
  if (sellMode === 'raw') return 0
  return crop.processing[sellMode]?.processDays ?? 0
}

/**
 * Returns the output name for the selected sell mode.
 */
export function getOutputName(crop: Crop, sellMode: SellMode): string {
  if (sellMode === 'raw') return crop.name
  return crop.processing[sellMode]?.output ?? crop.name
}
