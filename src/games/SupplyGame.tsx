import { useEffect, useState } from 'react'
import { playSound, speak } from '../lib/audio'
import type { MiniGameProps } from './types'

interface SupplyRound {
  before: number
  change: number
  operation: 'count' | 'add' | 'subtract'
  icon: string
  item: string
  prompt: string
  options: number[]
}

const roundsByLevel: Record<1 | 2 | 3, SupplyRound[]> = {
  1: [
    { before: 3, change: 0, operation: 'count', icon: '💧', item: '水壶', prompt: '补给车需要三只水壶，选出正确的数量。', options: [2, 3, 4] },
    { before: 5, change: 0, operation: 'count', icon: '🍎', item: '苹果', prompt: '请给考察队准备五个苹果。', options: [4, 5, 6] },
    { before: 4, change: 0, operation: 'count', icon: '🥪', item: '餐盒', prompt: '营地需要四份餐盒。', options: [3, 4, 5] }
  ],
  2: [
    { before: 3, change: 2, operation: 'add', icon: '📦', item: '补给箱', prompt: '营地原来有三箱，又送来两箱，一共有多少箱？', options: [4, 5, 6] },
    { before: 4, change: 3, operation: 'add', icon: '💧', item: '水壶', prompt: '车上有四只水壶，又装上三只，一共有多少只？', options: [6, 7, 8] },
    { before: 5, change: 4, operation: 'add', icon: '🍎', item: '苹果', prompt: '红筐有五个苹果，绿筐有四个，合起来有多少？', options: [8, 9, 10] }
  ],
  3: [
    { before: 8, change: 3, operation: 'subtract', icon: '🥪', item: '餐盒', prompt: '原来有八份餐盒，用掉三份，还剩多少份？', options: [4, 5, 6] },
    { before: 10, change: 4, operation: 'subtract', icon: '💧', item: '水壶', prompt: '十只水壶送去四只，车上还剩多少只？', options: [5, 6, 7] },
    { before: 9, change: 2, operation: 'subtract', icon: '📦', item: '补给箱', prompt: '九箱补给搬进营地两箱，车上还剩多少箱？', options: [6, 7, 8] }
  ]
}

function answerFor(round: SupplyRound): number {
  if (round.operation === 'add') return round.before + round.change
  if (round.operation === 'subtract') return round.before - round.change
  return round.before
}

export function SupplyGame({ level, soundEnabled, voiceEnabled, onComplete }: MiniGameProps) {
  const rounds = roundsByLevel[level]
  const [roundIndex, setRoundIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [locked, setLocked] = useState(false)
  const round = rounds[roundIndex]

  useEffect(() => {
    speak(round.prompt, voiceEnabled)
  }, [round.prompt, voiceEnabled])

  function choose(value: number) {
    if (locked) return
    if (value !== answerFor(round)) {
      setMessage('再用小手点一遍，看看一共有多少')
      playSound('try-again', soundEnabled)
      speak('别着急，再数一数', voiceEnabled)
      return
    }

    setLocked(true)
    setMessage('数量刚刚好！')
    playSound('correct', soundEnabled)
    window.setTimeout(() => {
      if (roundIndex === rounds.length - 1) {
        onComplete()
      } else {
        setRoundIndex((index) => index + 1)
        setMessage('')
        setLocked(false)
      }
    }, 700)
  }

  const removedStart = round.operation === 'subtract' ? round.before - round.change : round.before

  return (
    <div className="mini-game supply-game">
      <div className="round-meter">
        {rounds.map((_, index) => <span key={index} className={index <= roundIndex ? 'is-active' : ''} />)}
      </div>

      <div className="speech-prompt">
        <span className="speech-prompt__guide">🦕</span>
        <p>{round.prompt}</p>
        <button type="button" onClick={() => speak(round.prompt, voiceEnabled)} aria-label="再听一遍">🔊</button>
      </div>

      <div className="supply-scene" aria-label={`${round.item}数量图`}>
        <div className="supply-group">
          {Array.from({ length: round.before }, (_, index) => (
            <span
              key={index}
              className={round.operation === 'subtract' && index >= removedStart ? 'is-used' : ''}
            >
              {round.icon}
            </span>
          ))}
        </div>
        {round.operation !== 'count' && (
          <>
            <div className="operation-sign">{round.operation === 'add' ? '又来了' : '用掉了'}</div>
            <div className="supply-group secondary">
              {Array.from({ length: round.change }, (_, index) => <span key={index}>{round.icon}</span>)}
            </div>
          </>
        )}
      </div>

      <div className="number-choices" aria-label="选择答案">
        {round.options.map((option) => (
          <button type="button" key={option} onClick={() => choose(option)}>
            <strong>{option}</strong>
            <span aria-hidden="true">{Array.from({ length: option }, () => '•').join('')}</span>
          </button>
        ))}
      </div>
      <p className={`game-message ${message.includes('刚刚好') ? 'is-success' : ''}`} aria-live="polite">
        {message || '点一点正确的数量'}
      </p>
    </div>
  )
}
