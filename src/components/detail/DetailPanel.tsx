import { useSettingsContext } from '../../context/SettingsContext'
import { getCropsForSeason } from '../../data'
import { runCalc } from '../../calc'
import { SimpleDetail } from './SimpleDetail'
import { FullSeasonDetail } from './FullSeasonDetail'
import { CompoundingDetail } from './CompoundingDetail'
import { ProcessingDetail } from './ProcessingDetail'
import type { SimpleResult, FullSeasonResult, CompoundingResult, ProcessingResult } from '../../types'
import { useMemo } from 'react'

export function DetailPanel() {
  const { settings, selectedCropId, setSelectedCropId } = useSettingsContext()

  const selectedCrop = useMemo(() => {
    if (!selectedCropId) return null
    return getCropsForSeason(settings.season).find(c => c.id === selectedCropId) ?? null
  }, [selectedCropId, settings.season])

  const result = useMemo(() => {
    if (!selectedCrop) return null
    return runCalc(selectedCrop, settings)
  }, [selectedCrop, settings])

  if (!selectedCrop || !result) {
    return (
      <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-400 text-center mt-8">
          Click a crop to see details
        </p>
      </aside>
    )
  }

  return (
    <aside className="lg:flex flex-col w-72 shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <h2 className="font-semibold text-gray-900 text-sm">{selectedCrop.name}</h2>
        <button
          onClick={() => setSelectedCropId(null)}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none focus:outline-none"
          aria-label="Close detail panel"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        {settings.mode === 'simple' && (
          <SimpleDetail crop={selectedCrop} result={result as SimpleResult} />
        )}
        {settings.mode === 'fullSeason' && (
          <FullSeasonDetail crop={selectedCrop} result={result as FullSeasonResult} />
        )}
        {settings.mode === 'compounding' && (
          <CompoundingDetail crop={selectedCrop} result={result as CompoundingResult} />
        )}
        {settings.mode === 'processing' && (
          <ProcessingDetail crop={selectedCrop} result={result as ProcessingResult} />
        )}
      </div>
    </aside>
  )
}
