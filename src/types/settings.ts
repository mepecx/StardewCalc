export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'greenhouse'

export type Fertilizer = 'none' | 'speedGro' | 'deluxeSpeedGro'

export type FertilizerSource = 'pierre' | 'sandy'

export type CalcMode = 'simple' | 'fullSeason' | 'compounding' | 'processing'

export type QualityTier = 'normal' | 'silver' | 'gold' | 'iridium'

// 'raw' = sell crop directly. Others = process before selling.
// In Processing mode all options are shown side-by-side regardless of this value.
export type SellMode = 'raw' | 'preservesJar' | 'keg' | 'dehydrator' | 'oilMaker'

export interface UserSettings {
  season: Season
  mode: CalcMode
  sellMode: SellMode
  farmingLevel: number         // 0–10
  tillerProfession: boolean    // +10% crop sell price
  artisanProfession: boolean   // +40% processed goods price
  startingGold: number         // compounding mode only
  qualityEnabled: boolean      // quality distribution toggle (default OFF)
  greenhouseSeasons: number    // virtual seasons for greenhouse calc
  // New settings
  startDay: number             // season day you begin planting (1–28, default 1)
  tilesPlanted: number         // number of crop tiles planted (≥1, default 1)
  maxSeeds: number             // compounding: cap on seeds; 0 = unlimited
  unlimitedMaxSeeds: boolean   // toggle: ignore maxSeeds cap
  fertilizer: Fertilizer       // speed-gro fertilizer reduces initial grow time
  payForFertilizer: boolean    // deduct fertilizer cost from profit
  fertilizerSource: FertilizerSource  // vendor for fertilizer pricing
  machineCount: number         // how many processing machines are available
  unlimitedMachines: boolean   // toggle: ignore machineCount cap
  sellExcessRaw: boolean       // when machines are capped, sell excess crops at raw price instead of discarding
  darkMode: boolean
  pierreOpenWednesday: boolean  // CC complete or town key — Pierre open on Wed
  jojaAvailable: boolean        // allow buying seeds from JojaMart (higher prices)
}

export const DEFAULT_SETTINGS: UserSettings = {
  season: 'spring',
  mode: 'fullSeason',
  sellMode: 'raw',
  farmingLevel: 0,
  tillerProfession: false,
  artisanProfession: false,
  startingGold: 500,
  qualityEnabled: false,
  greenhouseSeasons: 4,
  startDay: 1,
  tilesPlanted: 1,
  maxSeeds: 0,
  unlimitedMaxSeeds: true,
  fertilizer: 'none',
  payForFertilizer: false,
  fertilizerSource: 'pierre',
  machineCount: 1,
  unlimitedMachines: true,
  sellExcessRaw: false,
  darkMode: false,
  pierreOpenWednesday: false,
  jojaAvailable: true,
}
