import { useEffect, useMemo, useState } from 'react'
import { playSound, speak } from '../lib/audio'
import type { MiniGameProps } from './types'

interface EquipmentItem {
  id: string
  icon: string
  label: string
}

const items: EquipmentItem[] = [
  { id: 'map', icon: '🗺️', label: '地图' },
  { id: 'water', icon: '💧', label: '水壶' },
  { id: 'brush', icon: '🖌️', label: '软刷' },
  { id: 'glass', icon: '🔍', label: '放大镜' },
  { id: 'gloves', icon: '🧤', label: '手套' },
  { id: 'lamp', icon: '🔦', label: '手电筒' },
  { id: 'book', icon: '📒', label: '记录本' },
  { id: 'rope', icon: '🪢', label: '安全绳' }
]

const roundsByLevel: Record<1 | 2 | 3, string[][]> = {
  1: [
    ['map', 'water'],
    ['brush', 'glass'],
    ['gloves', 'book']
  ],
  2: [
    ['map', 'brush', 'book'],
    ['water', 'gloves', 'rope'],
    ['glass', 'lamp', 'book']
  ],
  3: [
    ['map', 'water', 'brush', 'book'],
    ['gloves', 'glass', 'lamp', 'rope'],
    ['book', 'brush', 'map', 'gloves']
  ]
}

export function EquipmentGame({
  level,
  soundEnabled,
  voiceEnabled,
  onComplete
}: MiniGameProps) {
  const rounds = roundsByLevel[level]
  const [roundIndex, setRoundIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(false)
  const [showList, setShowList] = useState(true)
  const target = rounds[roundIndex]

  const targetItems = useMemo(
    () => target.map((id) => items.find((item) => item.id === id)!),
    [target]
  )

  useEffect(() => {
    setShowList(true)
    const names = targetItems.map((item) => item.label).join('、')
    speak(`第${roundIndex + 1}张任务卡，请带上${names}`, voiceEnabled)
    if (level === 3) {
      const timer = window.setTimeout(() => setShowList(false), 5200)
      return () => window.clearTimeout(timer)
    }
  }, [level, roundIndex, targetItems, voiceEnabled])

  function toggleItem(id: string) {
    if (checking) return
    playSound('tap', soundEnabled)
    setMessage('')
    setSelected((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : current.length < target.length
          ? [...current, id]
          : current
    )
  }

  function repeatTask() {
    setShowList(true)
    const names = targetItems.map((item) => item.label).join('、')
    speak(`请按顺序带上${names}`, voiceEnabled)
  }

  function checkBag() {
    if (selected.length !== target.length || checking) {
      setMessage(`还要选满${target.length}件装备哦`)
      playSound('try-again', soundEnabled)
      return
    }

    const correct = level === 3
      ? selected.every((id, index) => id === target[index])
      : target.every((id) => selected.includes(id))

    if (!correct) {
      setMessage(level === 3 ? '装备或顺序还不对，再听一遍吧' : '有一件装备不在任务卡上，再看看')
      playSound('try-again', soundEnabled)
      speak('没关系，再仔细检查一次', voiceEnabled)
      return
    }

    setChecking(true)
    setMessage('准备正确！')
    playSound('correct', soundEnabled)
    window.setTimeout(() => {
      if (roundIndex === rounds.length - 1) {
        onComplete()
      } else {
        setRoundIndex((value) => value + 1)
        setSelected([])
        setMessage('')
        setChecking(false)
      }
    }, 750)
  }

  return (
    <div className="mini-game equipment-game">
      <div className="round-meter" aria-label={`第${roundIndex + 1}轮，共${rounds.length}轮`}>
        {rounds.map((_, index) => (
          <span key={index} className={index <= roundIndex ? 'is-active' : ''} />
        ))}
      </div>

      <section className={`mission-note ${showList ? '' : 'is-folded'}`}>
        <div className="mission-note__pin">任务卡 {roundIndex + 1}</div>
        {showList ? (
          <div className="target-list">
            {targetItems.map((item, index) => (
              <div className="target-item" key={item.id}>
                {level === 3 && <b>{index + 1}</b>}
                <span>{item.icon}</span>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        ) : (
          <button className="repeat-task" onClick={repeatTask} type="button">
            🔊 再听一遍任务
          </button>
        )}
      </section>

      <div className="equipment-grid" aria-label="考察装备">
        {items.map((item) => {
          const selectedIndex = selected.indexOf(item.id)
          return (
            <button
              type="button"
              key={item.id}
              className={`equipment-card ${selectedIndex >= 0 ? 'is-selected' : ''}`}
              aria-pressed={selectedIndex >= 0}
              onClick={() => toggleItem(item.id)}
            >
              {selectedIndex >= 0 && (
                <span className="selection-order">{level === 3 ? selectedIndex + 1 : '✓'}</span>
              )}
              <span className="equipment-card__icon">{item.icon}</span>
              <strong>{item.label}</strong>
            </button>
          )
        })}
      </div>

      <div className="game-action-row">
        <p className={`game-message ${message.includes('正确') ? 'is-success' : ''}`} aria-live="polite">
          {message || `已经装好 ${selected.length} / ${target.length} 件`}
        </p>
        <button className="primary-button compact" type="button" onClick={checkBag}>
          检查背包
        </button>
      </div>
    </div>
  )
}
