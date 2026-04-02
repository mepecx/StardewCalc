import type { Crop, SellMode } from '../types'
import type { UserSettings } from '../types'
import { getAverageQualityMultiplier } from './qualityModifier'

export const TILLER_MULTIPLIER = 1.10
export const ARTISAN_MULTIPLIER = 1.40

// Seed Maker: 97.5% chance of 1-3 seeds (avg 2), 2% mixed, 0.5% ancient
export const SEED_MAKER_EXPECTED_SEEDS = 1.95   // 0.975 × 2
export const SEED_MAKER_CROPS_PER_DAY = 40       // ~20 min/crop, conservative estimate accounting for harvest/replant time

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
 * Returns true if Pierre is the only reliable shop source for this crop's seeds.
 * (No Joja or Oasis alternative.)
 */
export function isPierreOnlyCrop(crop: Crop): boolean {
  return crop.seedSource.includes('pierre') &&
    !crop.seedSource.includes('joja') &&
    !crop.seedSource.includes('oasis')
}

/**
 * In Stardew's Mon=1 calendar, Wednesdays are days where day % 7 === 3
 * (i.e. days 3, 10, 17, 24).
 */
export function isWednesday(day: number): boolean {
  return day % 7 === 3
}

/**
 * JojaMart seed price — 25% markup over Pierre's price (floor, matching game behavior).
 */
export function jojaSeedPrice(pierreCost: number): number {
  return Math.floor(pierreCost * 1.25)
}

export interface PurchaseInfo {
  day: number
  seedCost: number
  isJojaFallback: boolean
}

/**
 * Resolves where and when seeds can be purchased on a given day.
 * Returns the effective purchase day, seed cost, and whether Joja was used.
 *
 * Logic:
 * - If Pierre is open (not Wednesday, or pierreOpenWednesday=true): Pierre price
 * - If Pierre is closed and crop has Joja + jojaAvailable: Joja price (same day)
 * - If Pierre is closed and no Joja fallback: delay to Thursday at Pierre price
 * - If crop doesn't use Pierre at all (oasis, festival, etc.): no adjustment
 */
export function resolvePurchase(day: number, crop: Crop, settings: UserSettings): PurchaseInfo {
  const hasPierre = crop.seedSource.includes('pierre')

  // If Pierre isn't a source for this crop, no adjustment needed
  if (!hasPierre) {
    return { day, seedCost: crop.seedCost, isJojaFallback: false }
  }

  const pierreOpen = settings.pierreOpenWednesday || !isWednesday(day)
  if (pierreOpen) {
    return { day, seedCost: crop.seedCost, isJojaFallback: false }
  }

  // Pierre is closed (Wednesday) — check Joja fallback
  const hasJoja = crop.seedSource.includes('joja')
  if (hasJoja && settings.jojaAvailable) {
    return { day, seedCost: jojaSeedPrice(crop.seedCost), isJojaFallback: true }
  }

  // No Joja option or Joja disabled — wait for Thursday
  return { day: day + 1, seedCost: crop.seedCost, isJojaFallback: false }
}

/**
 * Returns true if the crop's seeds can only be obtained from festivals,
 * traveling merchant, or seed maker — i.e., no reliable everyday shop source.
 */
export function hasUnreliableSeedSource(crop: Crop): boolean {
  const reliableSources = ['pierre', 'joja', 'oasis', 'krobus', 'island']
  return !crop.seedSource.some(s => reliableSources.includes(s))
}

/**
 * Returns the output name for the selected sell mode.
 */
export function getOutputName(crop: Crop, sellMode: SellMode): string {
  if (sellMode === 'raw') return crop.name
  return crop.processing[sellMode]?.output ?? crop.name
}
