import { missions } from '../data/gameData'
import type { MissionStatus } from '../types/game'

export function getMissionStatus(
  missionId: string,
  completedMissionIds: string[]
): MissionStatus {
  if (completedMissionIds.includes(missionId)) return 'completed'

  const index = missions.findIndex((mission) => mission.id === missionId)
  if (index === -1) return 'locked'
  if (index === 0) return 'unlocked'

  return completedMissionIds.includes(missions[index - 1].id)
    ? 'unlocked'
    : 'locked'
}

export function getNextMissionId(
  currentMissionId: string,
  completedMissionIds: string[]
): string | null {
  const index = missions.findIndex((mission) => mission.id === currentMissionId)
  const next = missions[index + 1]
  if (!next) return null
  return getMissionStatus(next.id, completedMissionIds) !== 'locked' ? next.id : null
}

export function getCompletedCountForChapter(
  missionIds: string[],
  completedMissionIds: string[]
): number {
  return missionIds.filter((id) => completedMissionIds.includes(id)).length
}

export function calculateProgressPercent(completedMissionIds: string[]): number {
  return Math.round((completedMissionIds.length / missions.length) * 100)
}
