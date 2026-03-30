import type { SortKey, SortDir } from '../../hooks/useSort'

interface ColDef {
  key: SortKey
  label: string
  align?: 'left' | 'right'
  modes?: string[]
}

const COLUMNS: ColDef[] = [
  { key: 'name', label: 'Crop', align: 'left' },
  { key: 'seedCost', label: 'Seed Cost', align: 'right' },
  { key: 'totalProfit', label: 'Total Profit', align: 'right' },
  { key: 'profitPerDay', label: 'Profit / Day', align: 'right' },
  { key: 'totalHarvests', label: 'Harvests', align: 'right' },
  { key: 'peakSeeds', label: 'Peak Seeds', align: 'right', modes: ['compounding'] },
]

interface Props {
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  mode: string
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>
  return <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

export function CropTableHeader({ sortKey, sortDir, onSort, mode }: Props) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <tr>
        {COLUMNS.filter(col => !col.modes || col.modes.includes(mode)).map(col => (
          <th
            key={col.key}
            className={`px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide select-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              col.align === 'right' ? 'text-right' : 'text-left'
            }`}
            onClick={() => onSort(col.key)}
          >
            {col.label}
            <SortIcon active={sortKey === col.key} dir={sortDir} />
          </th>
        ))}
        <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Sources
        </th>
      </tr>
    </thead>
  )
}
