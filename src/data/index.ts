import type { Crop, Season } from '../types'
import springCrops from './crops/spring.json'
import summerCrops from './crops/summer.json'
import fallCrops from './crops/fall.json'
import winterCrops from './crops/winter.json'
import greenhouseCrops from './crops/greenhouse.json'

// All crops from season files, typed
const ALL_SEASON_CROPS: Crop[] = [
  ...springCrops,
  ...summerCrops,
  ...fallCrops,
  ...winterCrops,
] as Crop[]

// Greenhouse-exclusive crops (ancient fruit, cactus fruit, etc.)
const GREENHOUSE_EXCLUSIVE: Crop[] = greenhouseCrops as Crop[]

// Deduplicated list of all non-greenhouse crops (cross-season crops like Corn
// appear in multiple JSON files — keep only the first occurrence)
const seen = new Set<string>()
export const SEASONAL_CROPS: Crop[] = ALL_SEASON_CROPS.filter(c => {
  if (seen.has(c.id)) return false
  seen.add(c.id)
  return true
})

// All unique crops including greenhouse-exclusive ones
export const UNIQUE_CROPS: Crop[] = [
  ...SEASONAL_CROPS,
  ...GREENHOUSE_EXCLUSIVE,
]

/**
 * Returns crops available for a given season.
 * Greenhouse shows ALL crops (the greenhouse lets you grow any crop year-round)
 * plus greenhouse-exclusive crops.
 */
export function getCropsForSeason(season: Season | string): Crop[] {
  if (season === 'greenhouse') {
    // Greenhouse supports every crop plus greenhouse-exclusives
    // Exclude winter (no regular crops grow in winter even in greenhouse)
    return UNIQUE_CROPS
  }
  return SEASONAL_CROPS.filter(c => c.seasons.includes(season as Season))
}
