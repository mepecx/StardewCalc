import type { SortKey, SortDir } from '../../hooks/useSort'

interface ColDef {
  key: SortKey
  label: string
  align?: 'left' | 'right'
}

const COLUMNS: ColDef[] = [
  { key: 'name', label: 'Crop', align: 'left' },
  { key: 'seedCost', label: 'Seed Cost', align: 'right' },
  { key: 'totalProfit', label: 'Total Profit', align: 'right' },
  { key: 'profitPerDay', label: 'Profit / Day', align: 'right' },
  { key: 'totalHarvests', label: 'Harvests', align: 'right' },
]

interface Props {
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

export function CropTableHeader({ sortKey, sortDir, onSort }: Props) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {COLUMNS.map(col => (
          <th
            key={col.key}
            className={`px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide select-none cursor-pointer hover:bg-gray-100 transition-colors ${
              col.align === 'right' ? 'text-right' : 'text-left'
            }`}
            onClick={() => onSort(col.key)}
          >
            {col.label}
            <SortIcon active={sortKey === col.key} dir={sortDir} />
          </th>
        ))}
        <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Sources
        </th>
      </tr>
    </thead>
  )
}
