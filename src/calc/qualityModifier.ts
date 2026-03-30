import type { QualityTier } from '../types'

export const QUALITY_MULTIPLIERS: Record<QualityTier, number> = {
  normal: 1.0,
  silver: 1.25,
  gold: 1.5,
  iridium: 2.0,
}

/**
 * Returns the probability distribution of quality tiers at a given farming level (0–10).
 * Based on Stardew Valley wiki formula.
 */
export function getQualityDistribution(farmingLevel: number): Record<QualityTier, number> {
  const level = Math.min(Math.max(0, farmingLevel), 10)
  const gold = Math.min(0.2 + 0.04 * Math.floor(level / 2), 0.75)
  const silver = Math.min(0.2 + 0.04 * level, 0.75) - gold
  const iridium = level >= 10 ? gold / 2 : 0
  const normal = Math.max(0, 1 - silver - gold - iridium)

  return { normal, silver, gold, iridium }
}

/**
 * Returns the weighted average quality multiplier for a given farming level.
 */
export function getAverageQualityMultiplier(farmingLevel: number): number {
  const dist = getQualityDistribution(farmingLevel)
  return (
    dist.normal * QUALITY_MULTIPLIERS.normal +
    dist.silver * QUALITY_MULTIPLIERS.silver +
    dist.gold * QUALITY_MULTIPLIERS.gold +
    dist.iridium * QUALITY_MULTIPLIERS.iridium
  )
}
