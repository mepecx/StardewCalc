export function GoldIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" fill="#F4C430" stroke="#B8860B" strokeWidth="1.5" />
      <text
        x="8"
        y="11.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#7B5800"
        fontFamily="serif"
      >
        g
      </text>
    </svg>
  )
}

export function formatGold(amount: number): string {
  return `${Math.round(amount).toLocaleString()}g`
}
