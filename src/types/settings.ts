export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'greenhouse'

export type CalcMode = 'simple' | 'fullSeason' | 'compounding' | 'processing'

export type QualityTier = 'normal' | 'silver' | 'gold' | 'iridium'

// 'raw' = sell crop directly. Others = process before selling.
// In Processing mode all options are shown side-by-side regardless of this value.
export type SellMode = 'raw' | 'preservesJar' | 'keg' | 'dehydrator' | 'oilMaker'

export interface UserSettings {
  season: Season
  mode: CalcMode
  sellMode: SellMode
  farmingLevel: number        // 0–13
  tillerProfession: boolean   // +10% crop sell price
  artisanProfession: boolean  // +40% processed goods price
  startingGold: number        // compounding mode only
  qualityEnabled: boolean     // quality distribution toggle (default OFF)
  greenhouseSeasons: number   // virtual seasons for greenhouse calc
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
}
