import { useSettingsContext } from '../../context/SettingsContext'
import { DetailContent } from './DetailContent'

export function MobileDrawer() {
  const { selectedCropId, setSelectedCropId } = useSettingsContext()
  const isOpen = selectedCropId !== null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSelectedCropId(null)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-xl shadow-xl
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ maxHeight: '70vh' }}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle visual */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          <DetailContent onClose={() => setSelectedCropId(null)} />
        </div>
      </div>
    </>
  )
}
