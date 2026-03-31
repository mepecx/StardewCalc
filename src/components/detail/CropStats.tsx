import type { Crop } from '../../types'
import { useSettingsContext } from '../../context/SettingsContext'
import { GoldIcon, formatGold } from '../ui/GoldIcon'
import { effectiveSellPrice, effectiveGrowDays, fertilizerCostPerTile } from '../../calc/professionModifier'

interface Props {
  crop: Crop
}

export function CropStats({ crop }: Props) {
  const { settings } = useSettingsContext()
  const growDays = effectiveGrowDays(crop, settings)
  const rawGrow = crop.growDays
  const hasFertSpeedup = growDays < rawGrow
  const sellPrice = effectiveSellPrice(crop, settings, settings.mode === 'processing' ? 'raw' : settings.sellMode)
  const yieldPerHarvest = crop.baseYield + crop.extraYieldChance
  const fertCost = fertilizerCostPerTile(settings)

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1.5 text-sm mb-4">
      <Row label="Grow Time" value={hasFertSpeedup ? `${growDays} days (was ${rawGrow})` : `${rawGrow} days`} />
      {crop.regrowDays > 0 && (
        <Row label="Regrow" value={`${crop.regrowDays} days`} />
      )}
      <Row label="Seed Cost" value={formatGold(crop.seedCost)} gold />
      {fertCost > 0 && (
        <Row label="Fertilizer" value={`${formatGold(fertCost)}/tile`} gold />
      )}
      <Row label="Sell Price" value={`${formatGold(sellPrice)}/unit`} gold />
      <Row label="Yield / Harvest" value={yieldPerHarvest % 1 === 0 ? `${yieldPerHarvest}` : yieldPerHarvest.toFixed(2)} />
    </div>
  )
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`flex items-center gap-1 ${gold ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
        {gold && <GoldIcon className="w-3.5 h-3.5" />}
        {value}
      </span>
    </div>
  )
}
