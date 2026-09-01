export type GameKind =
  | 'equipment'
  | 'supply'
  | 'pattern'
  | 'fossil'
  | 'route'
  | 'record'

export type AppScreen = 'welcome' | 'base' | 'game'

export interface Mission {
  id: string
  chapterId: string
  number: number
  title: string
  shortTitle: string
  kind: GameKind
  level: 1 | 2 | 3
  icon: string
  description: string
  instruction: string
  discovery: string
}

export interface Chapter {
  id: string
  number: number
  eyebrow: string
  title: string
  subtitle: string
  location: string
  color: string
  paleColor: string
  illustration: 'mountain' | 'river' | 'forest'
  missionIds: string[]
}

export interface GameSettings {
  sound: boolean
  voice: boolean
  sessionMinutes: 8 | 10 | 15
}

export interface StoredProgress {
  id: 'local-player'
  completedMissionIds: string[]
  stamps: number
  settings: GameSettings
  lastPlayedAt: string | null
}

export type MissionStatus = 'completed' | 'unlocked' | 'locked'
