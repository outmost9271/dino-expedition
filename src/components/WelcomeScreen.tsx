import { useState } from 'react'
import { playSound } from '../lib/audio'
import { useGameStore } from '../store/gameStore'
import { Brand } from './Brand'
import { DinoMascot } from './DinoMascot'
import { SettingsModal } from './SettingsModal'

export function WelcomeScreen() {
  const startExpedition = useGameStore((state) => state.startExpedition)
  const completedCount = useGameStore((state) => state.completedMissionIds.length)
  const soundEnabled = useGameStore((state) => state.settings.sound)
  const [settingsOpen, setSettingsOpen] = useState(false)

  function start() {
    playSound('stamp', soundEnabled)
    startExpedition()
  }

  return (
    <main className="welcome-screen">
      <div className="welcome-sky" aria-hidden="true">
        <span className="cloud cloud--one" /><span className="cloud cloud--two" />
        <span className="sun-disc" />
      </div>

      <header className="welcome-header">
        <Brand />
        <button className="parent-button" type="button" onClick={() => setSettingsOpen(true)}>
          <span>⚙</span> 家长设置
        </button>
      </header>

      <section className="welcome-hero">
        <div className="welcome-copy">
          <div className="eyebrow-pill"><span>★</span> 原创儿童益智游戏</div>
          <h1>
            小队长，<br />
            <em>出发去发现！</em>
          </h1>
          <p>准备装备、修复化石、规划路线，<br className="desktop-only" />完成十八个中华恐龙考察任务。</p>

          <button className="start-button" type="button" onClick={start}>
            <span className="start-button__icon">🐾</span>
            <span>
              <small>{completedCount > 0 ? `已完成 ${completedCount} 个任务` : '第一站 · 云南禄丰'}</small>
              <strong>{completedCount > 0 ? '继续考察' : '开始考察'}</strong>
            </span>
            <b>→</b>
          </button>

          <div className="welcome-trust" aria-label="游戏特点">
            <span><i>✓</i> 无需登录</span>
            <span><i>✓</i> 没有广告</span>
            <span><i>✓</i> 本地存档</span>
          </div>
        </div>

        <div className="mascot-stage">
          <div className="mascot-callout">
            <span>你好呀！我是</span>
            <strong>考察员豆包</strong>
          </div>
          <DinoMascot />
          <div className="floating-card floating-card--fossil"><span>🦴</span><b>修复化石</b></div>
          <div className="floating-card floating-card--map"><span>🗺️</span><b>规划路线</b></div>
          <div className="floating-card floating-card--pattern"><span>🥚</span><b>发现规律</b></div>
        </div>
      </section>

      <section className="welcome-feature-strip" aria-label="学习内容">
        <div><span>01</span><p><strong>数学认知</strong><small>十以内数量关系</small></p></div>
        <div><span>02</span><p><strong>空间思维</strong><small>方向、旋转与拼合</small></p></div>
        <div><span>03</span><p><strong>专注计划</strong><small>先思考，再行动</small></p></div>
        <div><span>04</span><p><strong>观察记录</strong><small>比较、规律与图表</small></p></div>
      </section>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </main>
  )
}
