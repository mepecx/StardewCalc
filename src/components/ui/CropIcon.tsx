const imageModules = import.meta.glob('../../img/*.png', { eager: true, import: 'default' }) as Record<string, string>

const IMAGE_OVERRIDES: Record<string, string> = {
  'rice': 'unmilledrice',
}

function getCropImageUrl(cropId: string): string | null {
  const base = IMAGE_OVERRIDES[cropId] ?? cropId.replace(/-/g, '')
  const key = `../../img/${base}.png`
  return imageModules[key] ?? null
}

export function CropIcon({ cropId, className = 'w-5 h-5' }: { cropId: string; className?: string }) {
  const src = getCropImageUrl(cropId)
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      className={`${className} inline-block`}
      draggable={false}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
