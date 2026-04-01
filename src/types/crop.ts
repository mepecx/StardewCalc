import type { Season } from './settings'

export type CropCategory = 'vegetable' | 'fruit' | 'flower' | 'forage' | 'gem_crop'

export type ProcessorType = 'preservesJar' | 'keg' | 'dehydrator' | 'oilMaker'

export type SeedSource =
  | 'pierre'            // Pierre's General Store
  | 'joja'              // JojaMart
  | 'oasis'             // Sandy's Oasis (requires bus repair)
  | 'travelingMerchant' // Traveling Merchant (Fri/Sun, random stock)
  | 'eggFestival'       // Spring 13
  | 'stardewFair'       // Fall 16
  | 'nightMarket'       // Winter 15–17
  | 'seedMaker'         // Seed Maker from harvested crop
  | 'krobus'            // Krobus (Sewer)
  | 'island'            // Ginger Island shop

export interface ProcessingVariant {
  output: string
  sellPrice: number     // base price before Artisan profession
  processDays: number   // game-days per unit processed
  processor: ProcessorType
}

export interface Crop {
  id: string
  name: string
  seasons: Season[]
  seedCost: number
  seedSource: SeedSource[]
  growDays: number
  regrowDays: number          // 0 = does not regrow
  baseYield: number
  extraYieldChance: number    // 0–1 probability of one extra produce per harvest
  sellPrice: number           // base sell price (normal quality)
  category: CropCategory
  processing: Partial<Record<ProcessorType, ProcessingVariant>>
  giantCropChance?: number    // 0.01 default for eligible crops
  yearAvailable?: number      // earliest year seeds are purchasable (default 1)
  seedNotes?: string          // availability notes (e.g. "Egg Festival only")
}
