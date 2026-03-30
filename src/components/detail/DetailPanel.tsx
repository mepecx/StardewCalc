import { useState, useCallback, useRef, useEffect } from 'react'
import { useSettingsContext } from '../../context/SettingsContext'
import { DetailContent } from './DetailContent'

const MIN_WIDTH = 288   // 18rem (w-72)
const MAX_WIDTH = 640   // 40rem
const DEFAULT_WIDTH = 288

export function DetailPanel() {
  const { setSelectedCropId } = useSettingsContext()
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(DEFAULT_WIDTH)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    e.preventDefault()
  }, [width])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      // Dragging left = panel gets wider (panel is on right side)
      const delta = startX.current - e.clientX
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)))
    }
    const onMouseUp = () => { isDragging.current = false }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto relative"
      style={{ width }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400/40 dark:hover:bg-blue-500/40 active:bg-blue-400/60 dark:active:bg-blue-500/60 z-20 transition-colors"
        title="Drag to resize"
      />
      <DetailContent onClose={() => setSelectedCropId(null)} />
    </aside>
  )
}
