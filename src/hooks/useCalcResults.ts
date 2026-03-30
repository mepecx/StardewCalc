import { useMemo } from 'react'
import type { Crop, AnyResult } from '../types'
import { runCalc } from '../calc'
import type { UserSettings } from '../types'

export interface CropWithResult {
  crop: Crop
  result: AnyResult | null
}

export function useCalcResults(crops: Crop[], settings: UserSettings): CropWithResult[] {
  return useMemo(
    () => crops.map(crop => ({ crop, result: runCalc(crop, settings) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [crops, JSON.stringify(settings)],
  )
}
