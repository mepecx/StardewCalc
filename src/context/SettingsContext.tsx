import React, { createContext, useContext, useState, useCallback } from 'react'
import type { UserSettings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

const STORAGE_KEY = 'stardewcalc-settings'

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS
}

interface SettingsContextValue {
  settings: UserSettings
  updateSettings: (patch: Partial<UserSettings>) => void
  selectedCropId: string | null
  setSelectedCropId: (id: string | null) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(loadSettings)
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null)

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, selectedCropId, setSelectedCropId }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettingsContext must be used inside SettingsProvider')
  return ctx
}
