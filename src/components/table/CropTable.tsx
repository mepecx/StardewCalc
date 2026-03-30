import { useCalcResults } from '../../hooks/useCalcResults'
import { useSort } from '../../hooks/useSort'
import { useSettingsContext } from '../../context/SettingsContext'
import { getCropsForSeason } from '../../data'
import { CropTableHeader } from './CropTableHeader'
import { CropFilterBar } from './CropFilterBar'
import { CropRow } from './CropRow'
import { useMemo } from 'react'
import type { CropCategory } from '../../types'

interface Props {
  categoryFilter: CropCategory | 'all'
  setCategoryFilter: (f: CropCategory | 'all') => void
  basicSourceOnly: boolean
  setBasicSourceOnly: (v: boolean) => void
}

export function CropTable({ categoryFilter, setCategoryFilter, basicSourceOnly, setBasicSourceOnly }: Props) {
  const { settings, selectedCropId, setSelectedCropId } = useSettingsContext()
  const crops = useMemo(() => getCropsForSeason(settings.season), [settings.season])
  const items = useCalcResults(crops, settings)
  const { sorted, sortKey, sortDir, toggleSort } = useSort(items)

  const filtered = useMemo(() => sorted.filter(({ crop }) => {
    if (categoryFilter !== 'all') {
      // 'gem_crop' pill covers both gem_crop and forage categories
      if (categoryFilter === 'gem_crop') {
        if (crop.category !== 'gem_crop' && crop.category !== 'forage') return false
      } else {
        if (crop.category !== categoryFilter) return false
      }
    }
    if (basicSourceOnly && !crop.seedSource.some(s => s === 'pierre' || s === 'joja')) return false
    return true
  }), [sorted, categoryFilter, basicSourceOnly])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <CropFilterBar
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        basicSourceOnly={basicSourceOnly}
        setBasicSourceOnly={setBasicSourceOnly}
        totalCrops={sorted.length}
        visibleCrops={filtered.length}
      />
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-sm dark:bg-gray-850">
          <CropTableHeader sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} mode={settings.mode} />
          <tbody>
            {filtered.map(({ crop, result }) => (
              <CropRow
                key={crop.id}
                crop={crop}
                result={result}
                isSelected={selectedCropId === crop.id}
                onClick={() => setSelectedCropId(selectedCropId === crop.id ? null : crop.id)}
                mode={settings.mode}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={settings.mode === 'compounding' ? 7 : 6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                  {sorted.length === 0
                    ? 'No crops available for this season.'
                    : 'No crops match the current filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
