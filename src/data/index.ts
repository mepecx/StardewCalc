import type { Crop } from '../types'
import springCrops from './crops/spring.json'
import summerCrops from './crops/summer.json'
import fallCrops from './crops/fall.json'
import winterCrops from './crops/winter.json'
import greenhouseCrops from './crops/greenhouse.json'

// Merge all season data into a single typed array
export const ALL_CROPS: Crop[] = [
  ...springCrops,
  ...summerCrops,
  ...fallCrops,
  ...winterCrops,
  ...greenhouseCrops,
] as Crop[]

// Cross-season crops (Corn, Wheat, Sunflower, Coffee Bean) appear in multiple
// season arrays — they are deduplicated here by id for the all-crops list.
const seen = new Set<string>()
export const UNIQUE_CROPS: Crop[] = ALL_CROPS.filter(c => {
  if (seen.has(c.id)) return false
  seen.add(c.id)
  return true
})

export function getCropsForSeason(season: string): Crop[] {
  if (season === 'greenhouse') {
    return UNIQUE_CROPS.filter(c => c.seasons.includes('greenhouse'))
  }
  return UNIQUE_CROPS.filter(c => c.seasons.includes(season as Crop['seasons'][number]))
}
