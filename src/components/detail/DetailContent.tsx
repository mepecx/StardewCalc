import { useMemo } from 'react'
import { useSettingsContext } from '../../context/SettingsContext'
import { getCropsForSeason } from '../../data'
import { runCalc } from '../../calc'
import { SimpleDetail } from './SimpleDetail'
import { FullSeasonDetail } from './FullSeasonDetail'
import { CompoundingDetail } from './CompoundingDetail'
import { ProcessingDetail } from './ProcessingDetail'
import type { SimpleResult, FullSeasonResult, CompoundingResult, ProcessingResult } from '../../types'
import { CropIcon } from '../ui/CropIcon'

interface Props {
  onClose: () => void
}

export function DetailContent({ onClose }: Props) {
  const { settings, selectedCropId } = useSettingsContext()

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
      <p className="text-sm text-gray-400 text-center mt-8">
        Click a crop to see details
      </p>
    )
  }

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between z-10">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
          <CropIcon cropId={selectedCrop.id} className="w-5 h-5" />
          {selectedCrop.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none focus:outline-none"
          aria-label="Close detail panel"
        >
          ×
        </button>
      </div>

      {/* Mode-specific detail */}
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
    </>
  )
}
