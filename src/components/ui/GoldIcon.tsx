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
