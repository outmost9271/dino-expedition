import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { missionById, missions } from '../data/gameData'
import { playSound, speak, stopSpeaking } from '../lib/audio'
import { getNextMissionId } from '../lib/progress'
import { useGameStore } from '../store/gameStore'
import type { MiniGameProps } from '../games/types'
import { EquipmentGame } from '../games/EquipmentGame'
import { FossilGame } from '../games/FossilGame'
import { PatternGame } from '../games/PatternGame'
import { RecordGame } from '../games/RecordGame'
import { SupplyGame } from '../games/SupplyGame'
import { Brand } from './Brand'

const RouteGame = lazy(() => import('../games/RouteGame'))

const gameLabels = {
  equipment: '倾听与计划',
  supply: '数量关系',
  pattern: '观察规律',
  fossil: '空间旋转',
  route: '路线规划',
  record: '图表记录'
} as const

const offlineIdeas = {
  equipment: '离开屏幕后，自己整理一次明天要带的小物品。',
  supply: '找出五件小物品，把它们分成两组，看看有几种分法。',
  pattern: '用积木或筷子摆出一个会重复的规律。',
  fossil: '找一张纸，画一个由圆形和三角形组成的小恐龙。',
  route: '在房间里设计一条安全路线，再走一遍。',
  record: '观察家中三类物品，数一数哪一类最多。'
} as const

function GameLoading() {
  return <div className="game-loading"><span className="spinner" /><p>正在展开考察地图…</p></div>
}

export function GameScreen() {
  const missionId = useGameStore((state) => state.currentMissionId)
  const completedMissionIds = useGameStore((state) => state.completedMissionIds)
  const settings = useGameStore((state) => state.settings)
  const sessionCompleted = useGameStore((state) => state.sessionCompleted)
  const completeMission = useGameStore((state) => state.completeMission)
  const openMission = useGameStore((state) => state.openMission)
  const showBase = useGameStore((state) => state.showBase)
  const [finished, setFinished] = useState(false)

  const mission = missionId ? missionById[missionId] : null

  useEffect(() => () => stopSpeaking(), [])
  useEffect(() => {
    setFinished(false)
  }, [missionId])

  const handleComplete = useCallback(() => {
    if (!missionId) return
    completeMission(missionId)
    playSound('stamp', settings.sound)
    setFinished(true)
  }, [completeMission, missionId, settings.sound])

  if (!mission) {
    showBase()
    return null
  }

  const gameProps: MiniGameProps = {
    level: mission.level,
    soundEnabled: settings.sound,
    voiceEnabled: settings.voice,
    onComplete: handleComplete
  }

  const currentIndex = missions.findIndex((item) => item.id === mission.id)
  const nextMissionId = getNextMissionId(mission.id, completedMissionIds)
  const shouldRest = sessionCompleted >= 3

  function renderGame() {
    switch (mission!.kind) {
      case 'equipment': return <EquipmentGame {...gameProps} />
      case 'supply': return <SupplyGame {...gameProps} />
      case 'pattern': return <PatternGame {...gameProps} />
      case 'fossil': return <FossilGame {...gameProps} />
      case 'route': return <Suspense fallback={<GameLoading />}><RouteGame {...gameProps} /></Suspense>
      case 'record': return <RecordGame {...gameProps} />
    }
  }

  function goNext() {
    if (nextMissionId) openMission(nextMissionId)
    else showBase()
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <button type="button" className="back-button" onClick={showBase} aria-label="返回考察地图">← <span>返回地图</span></button>
        <Brand compact />
        <div className="game-header__progress">
          <small>总任务</small><strong>{currentIndex + 1}<span> / {missions.length}</span></strong>
        </div>
      </header>

      <section className="mission-heading">
        <div className="mission-heading__icon">{mission.icon}</div>
        <div>
          <span>{gameLabels[mission.kind]} · 难度 {mission.level}</span>
          <h1>{mission.title}</h1>
          <p>{mission.description}</p>
        </div>
        <button className="voice-button" type="button" onClick={() => speak(mission.instruction, settings.voice)}>
          <span>🔊</span><small>听任务</small>
        </button>
      </section>

      <section className="game-card">
        <div className="game-card__topline">
          <span><i /> 考察任务进行中</span>
          <p>{mission.instruction}</p>
        </div>
        {renderGame()}
      </section>

      {!finished && (
        <aside className="guide-tip">
          <span className="guide-tip__avatar">🦕</span>
          <p><strong>豆包提示</strong>不着急，先观察，再动手。答错也可以重新试。</p>
        </aside>
      )}

      {finished && (
        <div className="completion-backdrop" role="presentation">
          <section className="completion-card" role="dialog" aria-modal="true" aria-labelledby="completion-title">
            <div className="stamp-burst" aria-hidden="true"><i /><i /><i /><i /><i /><span>✦</span></div>
            <span className="completion-eyebrow">任务完成</span>
            <h2 id="completion-title">获得一枚考察印章！</h2>
            <p className="completion-discovery"><span>今天的发现</span>{mission.discovery}</p>
            <div className="offline-idea">
              <span>🌿</span><p><strong>屏幕外的小任务</strong>{offlineIdeas[mission.kind]}</p>
            </div>
            {shouldRest && (
              <div className="completion-rest"><span>👀</span><p><strong>已经完成三个新任务</strong>现在很适合看看远处，让眼睛休息一下。</p></div>
            )}
            <div className="completion-actions">
              <button type="button" className="secondary-button" onClick={showBase}>返回营地</button>
              {!shouldRest && nextMissionId && <button type="button" className="primary-button compact" onClick={goNext}>下一个任务 →</button>}
              {!nextMissionId && <button type="button" className="primary-button compact" onClick={showBase}>查看全部印章</button>}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
