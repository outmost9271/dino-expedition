import { create } from 'zustand'
import { clearProgress, createDefaultProgress, loadProgress, saveProgress } from '../lib/db'
import type { AppScreen, GameSettings, StoredProgress } from '../types/game'

interface GameStore {
  hydrated: boolean
  screen: AppScreen
  currentMissionId: string | null
  completedMissionIds: string[]
  stamps: number
  settings: GameSettings
  sessionCompleted: number
  sessionStartedAt: number | null
  hydrate: () => Promise<void>
  startExpedition: () => void
  showBase: () => void
  openMission: (missionId: string) => void
  completeMission: (missionId: string) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  resetProgress: () => Promise<void>
  resetSession: () => void
}

function snapshot(state: GameStore): StoredProgress {
  return {
    id: 'local-player',
    completedMissionIds: state.completedMissionIds,
    stamps: state.stamps,
    settings: state.settings,
    lastPlayedAt: new Date().toISOString()
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  hydrated: false,
  screen: 'welcome',
  currentMissionId: null,
  completedMissionIds: [],
  stamps: 0,
  settings: createDefaultProgress().settings,
  sessionCompleted: 0,
  sessionStartedAt: null,

  hydrate: async () => {
    const progress = await loadProgress()
    set({
      hydrated: true,
      completedMissionIds: progress.completedMissionIds,
      stamps: progress.stamps,
      settings: progress.settings
    })
  },

  startExpedition: () => {
    set((state) => ({
      screen: 'base',
      sessionStartedAt: state.sessionStartedAt ?? Date.now()
    }))
  },

  showBase: () => {
    set({ screen: 'base', currentMissionId: null })
  },

  openMission: (missionId) => {
    set((state) => ({
      screen: 'game',
      currentMissionId: missionId,
      sessionStartedAt: state.sessionStartedAt ?? Date.now()
    }))
  },

  completeMission: (missionId) => {
    const alreadyCompleted = get().completedMissionIds.includes(missionId)
    set((state) => ({
      completedMissionIds: alreadyCompleted
        ? state.completedMissionIds
        : [...state.completedMissionIds, missionId],
      stamps: alreadyCompleted ? state.stamps : state.stamps + 1,
      sessionCompleted: alreadyCompleted
        ? state.sessionCompleted
        : state.sessionCompleted + 1
    }))
    void saveProgress(snapshot(get()))
  },

  updateSettings: (updates) => {
    set((state) => ({ settings: { ...state.settings, ...updates } }))
    void saveProgress(snapshot(get()))
  },

  resetProgress: async () => {
    await clearProgress()
    const defaults = createDefaultProgress()
    set({
      screen: 'base',
      currentMissionId: null,
      completedMissionIds: [],
      stamps: 0,
      settings: defaults.settings,
      sessionCompleted: 0,
      sessionStartedAt: Date.now()
    })
  },

  resetSession: () => {
    set({ sessionCompleted: 0, sessionStartedAt: Date.now() })
  }
}))
