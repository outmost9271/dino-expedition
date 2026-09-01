import { useEffect, useMemo, useState } from 'react'
import { chapters, missionById, missions } from '../data/gameData'
import { playSound } from '../lib/audio'
import { calculateProgressPercent, getCompletedCountForChapter, getMissionStatus } from '../lib/progress'
import { useGameStore } from '../store/gameStore'
import { Brand } from './Brand'
import { ChapterScene } from './ChapterScene'
import { SettingsModal } from './SettingsModal'

export function BaseCamp() {
  const completedMissionIds = useGameStore((state) => state.completedMissionIds)
  const stamps = useGameStore((state) => state.stamps)
  const settings = useGameStore((state) => state.settings)
  const sessionCompleted = useGameStore((state) => state.sessionCompleted)
  const sessionStartedAt = useGameStore((state) => state.sessionStartedAt)
  const openMission = useGameStore((state) => state.openMission)
  const resetSession = useGameStore((state) => state.resetSession)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [clock, setClock] = useState(Date.now())
  const [restDismissed, setRestDismissed] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const progressPercent = calculateProgressPercent(completedMissionIds)
  const currentMission = useMemo(
    () => missions.find((mission) => getMissionStatus(mission.id, completedMissionIds) === 'unlocked'),
    [completedMissionIds]
  )
  const elapsedMinutes = sessionStartedAt ? (clock - sessionStartedAt) / 60_000 : 0
  const restDue = !restDismissed && (sessionCompleted >= 3 || elapsedMinutes >= settings.sessionMinutes)

  function launch(missionId: string) {
    if (getMissionStatus(missionId, completedMissionIds) === 'locked') return
    playSound('tap', settings.sound)
    openMission(missionId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function takeBreak() {
    resetSession()
    setRestDismissed(true)
  }

  return (
    <main className="base-screen">
      <header className="base-header">
        <Brand compact />
        <div className="base-header__actions">
          <div className="stamp-counter" aria-label={`已获得${stamps}枚考察印章`}><span>✦</span><b>{stamps}</b><small>考察印章</small></div>
          <button className="round-icon-button" type="button" aria-label="家长设置" onClick={() => setSettingsOpen(true)}>⚙</button>
        </div>
      </header>

      <section className="base-welcome">
        <div>
          <span className="section-eyebrow">小队长的考察地图</span>
          <h1>{completedMissionIds.length === 0 ? '第一站已经准备好！' : completedMissionIds.length === missions.length ? '全部考察完成！' : '今天去哪里发现？'}</h1>
          <p>{currentMission ? `下一个任务：${currentMission.title}` : '十八枚印章都收集齐了，可以自由重玩任何任务。'}</p>
        </div>
        <div className="overall-progress">
          <div className="progress-ring" style={{ '--progress': `${progressPercent * 3.6}deg` } as React.CSSProperties}>
            <span><b>{progressPercent}</b>%</span>
          </div>
          <p>总进度<small>{completedMissionIds.length} / {missions.length} 个任务</small></p>
        </div>
      </section>

      {restDue && (
        <section className="rest-banner" aria-live="polite">
          <div className="rest-banner__icon">🌳</div>
          <div><small>豆包的护眼提醒</small><h2>考察很精彩，眼睛也要休息啦！</h2><p>看看窗外远处，或者到户外寻找三种不同形状的叶子。</p></div>
          <button type="button" onClick={takeBreak}>我去休息一下</button>
        </section>
      )}

      <section className="chapter-list">
        {chapters.map((chapter) => {
          const completed = getCompletedCountForChapter(chapter.missionIds, completedMissionIds)
          const firstStatus = getMissionStatus(chapter.missionIds[0], completedMissionIds)
          return (
            <article className={`chapter-card ${firstStatus === 'locked' ? 'is-locked' : ''}`} key={chapter.id} style={{ '--chapter-color': chapter.color, '--chapter-pale': chapter.paleColor } as React.CSSProperties}>
              <div className="chapter-card__art">
                <div className="chapter-number">{chapter.eyebrow}<b>0{chapter.number}</b></div>
                <ChapterScene chapter={chapter} />
                <div className="chapter-location">⌖ {chapter.location}</div>
              </div>
              <div className="chapter-card__content">
                <div className="chapter-title-row">
                  <div><small>{chapter.eyebrow}</small><h2>{chapter.title}</h2></div>
                  <span>{completed}/6</span>
                </div>
                <p>{chapter.subtitle}</p>
                <div className="chapter-progress-track"><span style={{ width: `${(completed / 6) * 100}%` }} /></div>
                <div className="mission-grid">
                  {chapter.missionIds.map((missionId) => {
                    const mission = missionById[missionId]
                    const status = getMissionStatus(missionId, completedMissionIds)
                    return (
                      <button
                        type="button"
                        key={missionId}
                        className={`mission-tile is-${status}`}
                        disabled={status === 'locked'}
                        onClick={() => launch(missionId)}
                        aria-label={`${mission.number}，${mission.title}，${status === 'completed' ? '已完成' : status === 'locked' ? '未解锁' : '可以开始'}`}
                      >
                        <span className="mission-tile__number">{status === 'completed' ? '✓' : status === 'locked' ? '🔒' : mission.number}</span>
                        <span className="mission-tile__icon">{mission.icon}</span>
                        <strong>{mission.shortTitle}</strong>
                        {status === 'unlocked' && <small>开始任务 →</small>}
                        {status === 'completed' && <small>再玩一次</small>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <footer className="base-footer">
        <span>🛡️ 无广告 · 无账号 · 进度仅保存在本机</span>
        <span>建议每次完成三个任务后休息眼睛</span>
      </footer>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </main>
  )
}
