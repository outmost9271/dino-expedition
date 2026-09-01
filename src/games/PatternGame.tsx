import { useEffect, useState } from 'react'
import { playSound, speak } from '../lib/audio'
import type { MiniGameProps } from './types'

interface PatternRound {
  sequence: string[]
  answer: string
  choices: string[]
  label: string
}

const roundsByLevel: Record<1 | 2 | 3, PatternRound[]> = {
  1: [
    { sequence: ['🟠', '🟢', '🟠', '🟢', '?'], answer: '🟠', choices: ['🟠', '🟢', '🔵'], label: '橙、绿轮流出现' },
    { sequence: ['▲', '●', '▲', '●', '?'], answer: '▲', choices: ['●', '■', '▲'], label: '三角和圆轮流出现' },
    { sequence: ['🌿', '🐾', '🌿', '🐾', '?'], answer: '🌿', choices: ['🥚', '🌿', '🐾'], label: '叶子和脚印轮流出现' }
  ],
  2: [
    { sequence: ['🟠', '🟠', '🟢', '🟠', '🟠', '🟢', '?'], answer: '🟠', choices: ['🟢', '🟠', '🔵'], label: '两个橙色、一个绿色' },
    { sequence: ['▲', '●', '■', '▲', '●', '?'], answer: '■', choices: ['▲', '■', '●'], label: '三种形状依次出现' },
    { sequence: ['🌿', '🐾', '🐾', '🌿', '🐾', '🐾', '?'], answer: '🌿', choices: ['🐾', '🥚', '🌿'], label: '一片叶子、两个脚印' }
  ],
  3: [
    { sequence: ['🟠', '🟢', '🔵', '🟢', '🟠', '🟢', '🔵', '?'], answer: '🟢', choices: ['🟠', '🟢', '🔵'], label: '从橙到蓝，再回到绿' },
    { sequence: ['▲', '▲', '●', '■', '▲', '▲', '●', '?'], answer: '■', choices: ['●', '■', '▲'], label: '两个三角、圆形、方形' },
    { sequence: ['🪶', '🐾', '🪶', '🥚', '🪶', '🐾', '🪶', '?'], answer: '🥚', choices: ['🪶', '🥚', '🐾'], label: '羽毛总在奇数位置' }
  ]
}

export function PatternGame({ level, soundEnabled, voiceEnabled, onComplete }: MiniGameProps) {
  const rounds = roundsByLevel[level]
  const [roundIndex, setRoundIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [locked, setLocked] = useState(false)
  const round = rounds[roundIndex]

  useEffect(() => {
    speak('仔细观察，从头读一遍规律，问号的位置应该是什么？', voiceEnabled)
  }, [roundIndex, voiceEnabled])

  function choose(value: string) {
    if (locked) return
    if (value !== round.answer) {
      setMessage('这一组还没接上，再从第一个开始看')
      playSound('try-again', soundEnabled)
      return
    }
    setLocked(true)
    setMessage(`找到了！${round.label}`)
    playSound('correct', soundEnabled)
    window.setTimeout(() => {
      if (roundIndex === rounds.length - 1) onComplete()
      else {
        setRoundIndex((index) => index + 1)
        setMessage('')
        setLocked(false)
      }
    }, 800)
  }

  return (
    <div className="mini-game pattern-game">
      <div className="round-meter">
        {rounds.map((_, index) => <span key={index} className={index <= roundIndex ? 'is-active' : ''} />)}
      </div>
      <div className="pattern-board">
        <span className="pattern-board__label">岩层样本 {roundIndex + 1}</span>
        <div className="pattern-sequence" aria-label="规律序列">
          {round.sequence.map((token, index) => (
            <span key={`${token}-${index}`} className={token === '?' ? 'is-question' : ''}>{token}</span>
          ))}
        </div>
      </div>
      <p className="choice-question">问号的位置应该放什么？</p>
      <div className="pattern-choices">
        {round.choices.map((choice) => (
          <button key={choice} type="button" onClick={() => choose(choice)} aria-label={`选择${choice}`}>
            {choice}
          </button>
        ))}
      </div>
      <p className={`game-message ${message.includes('找到了') ? 'is-success' : ''}`} aria-live="polite">
        {message || '找一找重复的小组'}
      </p>
    </div>
  )
}
