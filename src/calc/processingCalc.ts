import type { Crop, ProcessingResult, ProcessingVariantResult, UserSettings } from '../types'
import type { SellMode } from '../types'
import { effectiveSellPrice, getProcessDays, getOutputName } from './professionModifier'
import { fullSeasonCalc } from './fullSeasonCalc'

const ALL_SELL_MODES: SellMode[] = ['raw', 'preservesJar', 'keg', 'dehydrator', 'oilMaker']

export function processingCalc(crop: Crop, settings: UserSettings): ProcessingResult | null {
  const { season } = settings
  const seasonDays = season === 'greenhouse' ? settings.greenhouseSeasons * 28 : 28

  if (crop.growDays > seasonDays) return null

  const variants: ProcessingVariantResult[] = []

  for (const mode of ALL_SELL_MODES) {
    if (mode !== 'raw' && !crop.processing[mode]) continue

    const baseResult = fullSeasonCalc(crop, settings, mode)
    if (!baseResult) continue

    const sellPrice = effectiveSellPrice(crop, settings, mode)
    const processDays = getProcessDays(crop, mode)
    const outputName = getOutputName(crop, mode)

    // Throughput: how many units can 1 machine process per season
    let processingBottleneck = ''
    if (processDays > 0) {
      const capacityPerMachine = Math.floor(seasonDays / processDays)
      const totalYield = Math.ceil(baseResult.totalYield)
      if (capacityPerMachine < totalYield) {
        const machinesNeeded = Math.ceil(totalYield / capacityPerMachine)
        processingBottleneck = `1 machine processes ${capacityPerMachine} units/season — need ${machinesNeeded} for full output`
      } else {
        processingBottleneck = 'Single machine sufficient'
      }
    }

    variants.push({
      sellMode: mode,
      outputName,
      sellPrice,
      profitPerDay: baseResult.profitPerDay,
      totalProfit: baseResult.totalProfit,
      processingBottleneck,
    })
  }

  if (variants.length === 0) return null

  // Sort descending by profitPerDay
  variants.sort((a, b) => b.profitPerDay - a.profitPerDay)
  const best = variants[0]

  // Pull harvest info from the raw full-season result for display purposes
  const rawResult = fullSeasonCalc(crop, settings, 'raw')

  return {
    cropId: crop.id,
    sellMode: best.sellMode,
    totalProfit: best.totalProfit,
    profitPerDay: best.profitPerDay,
    totalHarvests: rawResult?.totalHarvests ?? 0,
    totalYield: rawResult?.totalYield ?? 0,
    variants,
    bestSellMode: best.sellMode,
  }
}
