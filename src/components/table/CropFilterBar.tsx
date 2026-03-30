import type { CropCategory } from '../../types'

const CATEGORY_OPTIONS: { value: CropCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' },
  { value: 'vegetable', label: 'Vegetable', color: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60' },
  { value: 'fruit', label: 'Fruit', color: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60' },
  { value: 'flower', label: 'Flower', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:hover:bg-pink-900/60' },
  { value: 'gem_crop', label: 'Other', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60' },
]

interface Props {
  categoryFilter: CropCategory | 'all'
  setCategoryFilter: (f: CropCategory | 'all') => void
  basicSourceOnly: boolean
  setBasicSourceOnly: (v: boolean) => void
  totalCrops: number
  visibleCrops: number
}

export function CropFilterBar({ categoryFilter, setCategoryFilter, basicSourceOnly, setBasicSourceOnly, totalCrops, visibleCrops }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Category pills */}
      <div className="flex flex-wrap gap-1">
        {CATEGORY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setCategoryFilter(opt.value)}
            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${opt.color} ${
              categoryFilter === opt.value ? 'ring-2 ring-offset-1 ring-green-500 dark:ring-offset-gray-800' : ''
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 hidden sm:block" />

      {/* Pierre/Joja toggle */}
      <label className="flex items-center gap-1.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={basicSourceOnly}
          onChange={e => setBasicSourceOnly(e.target.checked)}
          className="accent-green-600 w-3.5 h-3.5"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400">Pierre / Joja only</span>
      </label>

      {/* Crop count */}
      {(categoryFilter !== 'all' || basicSourceOnly) && (
        <span className="ml-auto text-xs text-gray-400">
          {visibleCrops} of {totalCrops} crops
        </span>
      )}
    </div>
  )
}
