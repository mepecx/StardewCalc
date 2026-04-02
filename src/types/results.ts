import type { ProcessorType, SeedSource } from './crop'
import type { SellMode } from './settings'

export interface BaseResult {
  cropId: string
  sellMode: SellMode
  totalProfit: number
  profitPerDay: number
  totalHarvests: number
  totalYield: number
  processingNote?: string   // e.g. "needs 3 machines for full throughput"
}

export interface SimpleResult extends BaseResult {
  revenue: number
  seedCost: number
  effectiveDays: number     // growDays + processDays; denominator for profitPerDay
}

export interface HarvestEvent {
  plantDay?: number         // day this cycle's seeds were planted (undefined for regrow after first)
  harvestDay: number
  readyDay: number          // harvestDay + processDays (= harvestDay if raw)
  yieldAmount: number
  processedYield: number    // units that went through a machine (= yieldAmount when unlimited)
  excessYield: number       // units that couldn't be processed (machine cap exceeded)
  excessRevenue: number     // revenue from excess sold raw (0 when sellExcessRaw=false or unlimited)
  batchRevenue: number
  cumulativeProfit: number
  seedCost: number          // total gold spent on seeds for this planting (0 for regrow/seed maker)
  isJojaFallback?: boolean  // seeds bought from Joja
  cropsDivertedToSeedMaker?: number  // crops sent to seed maker this harvest (reduces sellable yield)
  isSeedMakerReplant?: boolean       // true if planted via seed maker (no gold cost)
}

export interface FullSeasonResult extends BaseResult {
  harvestSchedule: HarvestEvent[]
  daysUsed: number
  seedsPlanted: number
  batchesCompletedInSeason: number
  batchesSpillingOver: number
  seedMakerInfo?: SeedMakerInfo
}

export type CompoundingAction = 'plant' | 'harvest+processing' | 'regrow' | 'sell' | 'sell+replant' | 'final_sell'

export interface CompoundingSnapshot {
  day: number
  seeds: number
  goldOnHand: number
  cumulativeProfit: number
  action: CompoundingAction
  excessYield?: number      // units sold raw due to machine cap (set on harvest events)
  excessRevenue?: number    // gold earned from excess raw sales (set on harvest events)
  batchId?: number          // which batch this event belongs to (harvest/regrow events only)
  batchTiles?: number       // tiles in this specific batch (harvest/regrow events only)
  isJojaFallback?: boolean  // seeds bought from Joja (Pierre closed on Wednesday)
  cropsDivertedToSeedMaker?: number  // crops sent to seed maker this cycle
  seedsFromSeedMaker?: number        // seeds produced by seed maker this cycle
  cropsSold?: number                 // crops sold (remaining after seed maker diversion)
}

export interface SeedMakerInfo {
  cropsDiverted: number           // total crops sent to seed maker across all cycles
  seedsProduced: number           // total seeds produced
  peakCropsDivertedPerDay: number // max crops diverted in a single cycle
  recommendedMachines: number     // ceil(peak / 60)
}

export interface CompoundingResult extends BaseResult {
  timeline: CompoundingSnapshot[]
  finalGold: number
  peakSeeds: number
  reinvestCycleDays: number
  seedMakerInfo?: SeedMakerInfo
}

export interface ProcessingVariantResult {
  sellMode: SellMode
  outputName: string
  sellPrice: number
  profitPerDay: number
  totalProfit: number
  processingBottleneck: string
}

export interface ProcessingResult extends BaseResult {
  variants: ProcessingVariantResult[]
  bestSellMode: SellMode
}

export type AnyResult = SimpleResult | FullSeasonResult | CompoundingResult | ProcessingResult

// Re-export so callers only need one import
export type { ProcessorType, SeedSource }
