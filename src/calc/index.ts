import type { Crop, AnyResult, UserSettings } from '../types'
import { simpleCalc } from './simpleCalc'
import { fullSeasonCalc } from './fullSeasonCalc'
import { compoundingCalc } from './compoundingCalc'
import { processingCalc } from './processingCalc'

export function runCalc(crop: Crop, settings: UserSettings): AnyResult | null {
  switch (settings.mode) {
    case 'simple':      return simpleCalc(crop, settings)
    case 'fullSeason':  return fullSeasonCalc(crop, settings)
    case 'compounding': return compoundingCalc(crop, settings)
    case 'processing':  return processingCalc(crop, settings)
  }
}

export { simpleCalc, fullSeasonCalc, compoundingCalc, processingCalc }
export * from './qualityModifier'
export * from './professionModifier'
