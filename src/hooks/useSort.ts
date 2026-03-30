import { useState, useMemo } from 'react'
import type { CropWithResult } from './useCalcResults'
import type { CompoundingResult } from '../types'

export type SortKey = 'name' | 'seedCost' | 'profitPerDay' | 'totalProfit' | 'totalHarvests' | 'peakSeeds'
export type SortDir = 'asc' | 'desc'

export function useSort(items: CropWithResult[]) {
  const [sortKey, setSortKey] = useState<SortKey>('profitPerDay')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      let valA: number | string
      let valB: number | string

      switch (sortKey) {
        case 'name':
          valA = a.crop.name
          valB = b.crop.name
          break
        case 'seedCost':
          valA = a.crop.seedCost
          valB = b.crop.seedCost
          break
        case 'profitPerDay':
          valA = a.result?.profitPerDay ?? -Infinity
          valB = b.result?.profitPerDay ?? -Infinity
          break
        case 'totalProfit':
          valA = a.result?.totalProfit ?? -Infinity
          valB = b.result?.totalProfit ?? -Infinity
          break
        case 'totalHarvests':
          valA = a.result?.totalHarvests ?? 0
          valB = b.result?.totalHarvests ?? 0
          break
        case 'peakSeeds':
          valA = (a.result as CompoundingResult | undefined)?.peakSeeds ?? 0
          valB = (b.result as CompoundingResult | undefined)?.peakSeeds ?? 0
          break
      }

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB as string)
        return sortDir === 'asc' ? cmp : -cmp
      }
      const cmp = (valA as number) - (valB as number)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [items, sortKey, sortDir])

  return { sorted, sortKey, sortDir, toggleSort }
}
