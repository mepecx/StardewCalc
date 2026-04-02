import type { Crop } from '../../types'
import { useSettingsContext } from '../../context/SettingsContext'
import { GoldIcon, formatGold } from '../ui/GoldIcon'
import { effectiveSellPrice, effectiveGrowDays, fertilizerCostPerTile, resolvePurchase } from '../../calc/professionModifier'

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
  const yearAvail = crop.yearAvailable ?? 1
  const isSeedMakerActive = settings.useSeedMaker &&
    (settings.mode === 'fullSeason' || settings.mode === 'compounding')
  const purchase = resolvePurchase(settings.startDay, crop, settings)

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1.5 text-sm mb-4">
      <Row label="Grow Time" value={hasFertSpeedup ? `${growDays} days (was ${rawGrow})` : `${rawGrow} days`} />
      {crop.regrowDays > 0 && (
        <Row label="Regrow" value={`${crop.regrowDays} days`} />
      )}
      <Row
        label="Seed Cost"
        value={purchase.isJojaFallback
          ? `${formatGold(purchase.seedCost)} (Joja)`
          : formatGold(crop.seedCost)}
        gold
        warn={purchase.isJojaFallback}
      />
      {isSeedMakerActive && (
        <Row label="Replanting" value="Seed Maker" teal />
      )}
      {fertCost > 0 && (
        <Row label="Fertilizer" value={`${formatGold(fertCost)}/tile`} gold />
      )}
      <Row label="Sell Price" value={`${formatGold(sellPrice)}/unit`} gold />
      <Row label="Yield / Harvest" value={yieldPerHarvest % 1 === 0 ? `${yieldPerHarvest}` : yieldPerHarvest.toFixed(2)} />
      {yearAvail > 1 && (
        <Row label="Available" value={`Year ${yearAvail}+`} warn />
      )}
      {crop.seedNotes && (
        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded px-2 py-1 mt-1.5">
          {crop.seedNotes}
        </p>
      )}
    </div>
  )
}

function Row({ label, value, gold, warn, teal }: { label: string; value: string; gold?: boolean; warn?: boolean; teal?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`flex items-center gap-1 ${
        teal ? 'text-teal-600 dark:text-teal-400 font-medium'
        : warn ? 'text-amber-700 dark:text-amber-400 font-medium'
        : gold ? 'text-gray-900 dark:text-gray-100'
        : 'text-gray-700 dark:text-gray-300'
      }`}>
        {gold && <GoldIcon className="w-3.5 h-3.5" />}
        {value}
      </span>
    </div>
  )
}
