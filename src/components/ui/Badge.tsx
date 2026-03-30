import type { CropCategory, SeedSource } from '../../types'
import { Tooltip } from './Tooltip'

const CATEGORY_COLORS: Record<CropCategory, string> = {
  vegetable: 'bg-green-100 text-green-800',
  fruit: 'bg-red-100 text-red-800',
  flower: 'bg-pink-100 text-pink-800',
  forage: 'bg-lime-100 text-lime-800',
  gem_crop: 'bg-purple-100 text-purple-800',
}

const CATEGORY_LABELS: Record<CropCategory, string> = {
  vegetable: 'Veg',
  fruit: 'Fruit',
  flower: 'Flower',
  forage: 'Forage',
  gem_crop: 'Gem',
}

const SOURCE_COLORS: Record<SeedSource, string> = {
  pierre: 'bg-blue-100 text-blue-800',
  joja: 'bg-gray-100 text-gray-700',
  oasis: 'bg-amber-100 text-amber-800',
  travelingMerchant: 'bg-purple-100 text-purple-800',
  eggFestival: 'bg-yellow-100 text-yellow-800',
  stardewFair: 'bg-orange-100 text-orange-800',
  nightMarket: 'bg-indigo-100 text-indigo-800',
  seedMaker: 'bg-teal-100 text-teal-800',
  krobus: 'bg-slate-100 text-slate-700',
  island: 'bg-emerald-100 text-emerald-800',
}

const SOURCE_LABELS: Record<SeedSource, string> = {
  pierre: "Pierre's",
  joja: 'Joja',
  oasis: 'Oasis',
  travelingMerchant: 'Merchant',
  eggFestival: 'Egg Fest.',
  stardewFair: 'SDV Fair',
  nightMarket: 'Night Mkt',
  seedMaker: 'Seed Maker',
  krobus: 'Krobus',
  island: 'Island',
}

const SOURCE_FULL_LABELS: Record<SeedSource, string> = {
  pierre: "Pierre's General Store",
  joja: 'JojaMart',
  oasis: "Sandy's Oasis (requires bus)",
  travelingMerchant: 'Traveling Merchant (Fri/Sun)',
  eggFestival: 'Egg Festival (Spring 13)',
  stardewFair: 'Stardew Valley Fair (Fall 16)',
  nightMarket: 'Night Market (Winter 15–17)',
  seedMaker: 'Seed Maker',
  krobus: 'Krobus (Sewer)',
  island: 'Ginger Island Shop',
}

interface BadgeProps {
  className?: string
}

export function CategoryBadge({ category, className = '' }: { category: CropCategory } & BadgeProps) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[category]} ${className}`}>
      {CATEGORY_LABELS[category]}
    </span>
  )
}

export function SeedSourceBadge({ source }: { source: SeedSource }) {
  return (
    <Tooltip text={SOURCE_FULL_LABELS[source]}>
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${SOURCE_COLORS[source]}`}>
        {SOURCE_LABELS[source]}
      </span>
    </Tooltip>
  )
}
