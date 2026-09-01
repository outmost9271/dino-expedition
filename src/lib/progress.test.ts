import { describe, expect, it } from 'vitest'
import { missions } from '../data/gameData'
import {
  calculateProgressPercent,
  getCompletedCountForChapter,
  getMissionStatus,
  getNextMissionId
} from './progress'

describe('考察进度规则', () => {
  it('只解锁第一个未完成的连续任务', () => {
    expect(getMissionStatus('yn-01', [])).toBe('unlocked')
    expect(getMissionStatus('yn-02', [])).toBe('locked')

    expect(getMissionStatus('yn-01', ['yn-01'])).toBe('completed')
    expect(getMissionStatus('yn-02', ['yn-01'])).toBe('unlocked')
    expect(getMissionStatus('yn-03', ['yn-01'])).toBe('locked')
  })

  it('完成任务后能找到下一关', () => {
    expect(getNextMissionId('yn-01', ['yn-01'])).toBe('yn-02')
    expect(getNextMissionId('ln-06', missions.map((mission) => mission.id))).toBeNull()
  })

  it('正确计算章节与总进度', () => {
    const completed = ['yn-01', 'yn-02', 'yn-03']
    expect(getCompletedCountForChapter(missions.slice(0, 6).map((mission) => mission.id), completed)).toBe(3)
    expect(calculateProgressPercent(completed)).toBe(17)
    expect(calculateProgressPercent(missions.map((mission) => mission.id))).toBe(100)
  })
})
