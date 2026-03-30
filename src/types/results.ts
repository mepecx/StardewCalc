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
  harvestDay: number
  readyDay: number          // harvestDay + processDays (= harvestDay if raw)
  yieldAmount: number
  batchRevenue: number
  cumulativeProfit: number
}

export interface FullSeasonResult extends BaseResult {
  harvestSchedule: HarvestEvent[]
  daysUsed: number
  seedsPlanted: number
  batchesCompletedInSeason: number
  batchesSpillingOver: number
}

export type CompoundingAction = 'plant' | 'harvest+processing' | 'sell+replant' | 'final_sell'

export interface CompoundingSnapshot {
  day: number
  seeds: number
  goldOnHand: number
  cumulativeProfit: number
  action: CompoundingAction
}

export interface CompoundingResult extends BaseResult {
  timeline: CompoundingSnapshot[]
  finalGold: number
  peakSeeds: number
  reinvestCycleDays: number
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
