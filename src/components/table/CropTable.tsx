import { useCalcResults } from '../../hooks/useCalcResults'
import { useSort } from '../../hooks/useSort'
import { useSettingsContext } from '../../context/SettingsContext'
import { getCropsForSeason } from '../../data'
import { CropTableHeader } from './CropTableHeader'
import { CropRow } from './CropRow'
import { useMemo } from 'react'

export function CropTable() {
  const { settings, selectedCropId, setSelectedCropId } = useSettingsContext()
  const crops = useMemo(() => getCropsForSeason(settings.season), [settings.season])
  const items = useCalcResults(crops, settings)
  const { sorted, sortKey, sortDir, toggleSort } = useSort(items)

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full border-collapse text-sm">
        <CropTableHeader sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <tbody>
          {sorted.map(({ crop, result }) => (
            <CropRow
              key={crop.id}
              crop={crop}
              result={result}
              isSelected={selectedCropId === crop.id}
              onClick={() => setSelectedCropId(selectedCropId === crop.id ? null : crop.id)}
              mode={settings.mode}
            />
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                No crops available for this season.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
