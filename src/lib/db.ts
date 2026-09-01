import Dexie, { type EntityTable } from 'dexie'
import type { StoredProgress } from '../types/game'

const localStorageKey = 'zhonghua-dinosaur-expedition-progress'
const defaultProgress: StoredProgress = {
  id: 'local-player',
  completedMissionIds: [],
  stamps: 0,
  settings: {
    sound: true,
    voice: true,
    sessionMinutes: 10
  },
  lastPlayedAt: null
}

class ExpeditionDatabase extends Dexie {
  progress!: EntityTable<StoredProgress, 'id'>

  constructor() {
    super('zhonghua-dinosaur-expedition')
    this.version(1).stores({
      progress: 'id'
    })
  }
}

export const db = new ExpeditionDatabase()

export function createDefaultProgress(): StoredProgress {
  return {
    ...defaultProgress,
    completedMissionIds: [],
    settings: { ...defaultProgress.settings }
  }
}

function loadLocalBackup(): StoredProgress | null {
  try {
    const value = localStorage.getItem(localStorageKey)
    if (!value) return null
    const parsed = JSON.parse(value) as StoredProgress
    if (parsed.id !== 'local-player' || !Array.isArray(parsed.completedMissionIds)) return null
    return parsed
  } catch {
    return null
  }
}

function saveLocalBackup(progress: StoredProgress): void {
  try {
    localStorage.setItem(localStorageKey, JSON.stringify(progress))
  } catch {
    // 某些隐私模式会禁用本地存储，当前页面仍可继续游玩。
  }
}

export async function loadProgress(): Promise<StoredProgress> {
  try {
    const stored = await db.progress.get('local-player')
    return stored ?? loadLocalBackup() ?? createDefaultProgress()
  } catch {
    // file:// 下部分浏览器禁用 IndexedDB，此时使用 localStorage 备份。
    return loadLocalBackup() ?? createDefaultProgress()
  }
}

export async function saveProgress(progress: StoredProgress): Promise<void> {
  saveLocalBackup(progress)
  try {
    await db.progress.put(progress)
  } catch {
    // 本地双击版可能无法使用 IndexedDB，localStorage 已完成保存。
  }
}

export async function clearProgress(): Promise<void> {
  try {
    localStorage.removeItem(localStorageKey)
  } catch {
    // 保持界面可用即可。
  }
  try {
    await db.progress.delete('local-player')
  } catch {
    // 保持界面可用即可。
  }
}
