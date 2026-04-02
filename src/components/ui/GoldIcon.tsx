import goldImg from '../../img/gold.png'

export function GoldIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <img
      src={goldImg}
      alt="gold"
      className={`${className} inline-block`}
      draggable={false}
    />
  )
}

export function formatGold(amount: number): string {
  return `${Math.round(amount).toLocaleString()}g`
}

const SEASON_NAMES = ['spring', 'summer', 'fall', 'winter'] as const
const SEASON_LABELS: Record<string, string> = { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' }

/**
 * Formats a day number as "Season, Day X" when it exceeds 28 (the current season),
 * or as "Day X" when within the current season. For greenhouse, always "Day X".
 */
export function formatDay(day: number, currentSeason: string): string {
  if (currentSeason === 'greenhouse' || day <= 28) {
    return `Day ${day}`
  }
  const startSeasonIdx = SEASON_NAMES.indexOf(currentSeason as typeof SEASON_NAMES[number])
  const seasonsElapsed = Math.floor((day - 1) / 28)
  const dayInSeason = ((day - 1) % 28) + 1
  const targetIdx = (startSeasonIdx + seasonsElapsed) % 4
  return `${SEASON_LABELS[SEASON_NAMES[targetIdx]]}, Day ${dayInSeason}`
}
