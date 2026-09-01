import { useEffect, useState } from 'react'
import { playSound, speak } from '../lib/audio'
import type { MiniGameProps } from './types'

interface ChartItem {
  label: string
  icon: string
  count: number
}

interface RecordRound {
  items: ChartItem[]
  question: string
  answer: string
  options: string[]
}

const roundsByLevel: Record<1 | 2 | 3, RecordRound[]> = {
  1: [
    { items: [{ label: '脚印', icon: '🐾', count: 4 }, { label: '蛋壳', icon: '🥚', count: 2 }, { label: '叶片', icon: '🌿', count: 3 }], question: '今天发现了几枚脚印？', answer: '4', options: ['3', '4', '5'] },
    { items: [{ label: '脚印', icon: '🐾', count: 2 }, { label: '蛋壳', icon: '🥚', count: 5 }, { label: '叶片', icon: '🌿', count: 3 }], question: '今天发现了几片蛋壳？', answer: '5', options: ['4', '5', '6'] },
    { items: [{ label: '脚印', icon: '🐾', count: 3 }, { label: '蛋壳', icon: '🥚', count: 2 }, { label: '叶片', icon: '🌿', count: 4 }], question: '今天发现了几片叶子印迹？', answer: '4', options: ['2', '3', '4'] }
  ],
  2: [
    { items: [{ label: '脚印', icon: '🐾', count: 5 }, { label: '蛋壳', icon: '🥚', count: 3 }, { label: '叶片', icon: '🌿', count: 4 }], question: '哪一种发现最多？', answer: '脚印', options: ['脚印', '蛋壳', '叶片'] },
    { items: [{ label: '脚印', icon: '🐾', count: 2 }, { label: '蛋壳', icon: '🥚', count: 4 }, { label: '叶片', icon: '🌿', count: 3 }], question: '哪一种发现最少？', answer: '脚印', options: ['脚印', '蛋壳', '叶片'] },
    { items: [{ label: '脚印', icon: '🐾', count: 4 }, { label: '蛋壳', icon: '🥚', count: 2 }, { label: '叶片', icon: '🌿', count: 4 }], question: '哪两种发现一样多？', answer: '脚印和叶片', options: ['脚印和蛋壳', '蛋壳和叶片', '脚印和叶片'] }
  ],
  3: [
    { items: [{ label: '脚印', icon: '🐾', count: 5 }, { label: '蛋壳', icon: '🥚', count: 3 }, { label: '叶片', icon: '🌿', count: 4 }], question: '脚印比蛋壳多几个？', answer: '2', options: ['1', '2', '3'] },
    { items: [{ label: '脚印', icon: '🐾', count: 4 }, { label: '蛋壳', icon: '🥚', count: 2 }, { label: '叶片', icon: '🌿', count: 3 }], question: '蛋壳和叶片合起来有几个？', answer: '5', options: ['4', '5', '6'] },
    { items: [{ label: '脚印', icon: '🐾', count: 3 }, { label: '蛋壳', icon: '🥚', count: 3 }, { label: '叶片', icon: '🌿', count: 4 }], question: '三种发现一共有几个？', answer: '10', options: ['9', '10', '11'] }
  ]
}

export function RecordGame({ level, soundEnabled, voiceEnabled, onComplete }: MiniGameProps) {
  const rounds = roundsByLevel[level]
  const [roundIndex, setRoundIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [locked, setLocked] = useState(false)
  const round = rounds[roundIndex]

  useEffect(() => {
    speak(round.question, voiceEnabled)
  }, [round.question, voiceEnabled])

  function choose(option: string) {
    if (locked) return
    if (option !== round.answer) {
      setMessage('先看清每一行，再数一次')
      playSound('try-again', soundEnabled)
      return
    }
    setLocked(true)
    setMessage('记录正确！')
    playSound('correct', soundEnabled)
    window.setTimeout(() => {
      if (roundIndex === rounds.length - 1) onComplete()
      else {
        setRoundIndex((index) => index + 1)
        setMessage('')
        setLocked(false)
      }
    }, 700)
  }

  return (
    <div className="mini-game record-game">
      <div className="round-meter">
        {rounds.map((_, index) => <span key={index} className={index <= roundIndex ? 'is-active' : ''} />)}
      </div>
      <div className="clipboard">
        <div className="clipboard__clip">第 {roundIndex + 1} 份观察记录</div>
        <div className="picture-chart">
          {round.items.map((item) => (
            <div className="chart-row" key={item.label}>
              <strong>{item.label}</strong>
              <div className="chart-icons" aria-label={`${item.label}${item.count}个`}>
                {Array.from({ length: item.count }, (_, index) => <span key={index}>{item.icon}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3 className="record-question">{round.question}</h3>
      <div className="text-choices">
        {round.options.map((option) => (
          <button type="button" key={option} onClick={() => choose(option)}>{option}</button>
        ))}
      </div>
      <p className={`game-message ${message.includes('正确') ? 'is-success' : ''}`} aria-live="polite">
        {message || '从图表中找答案'}
      </p>
    </div>
  )
}
