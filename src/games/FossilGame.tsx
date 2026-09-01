import { useEffect, useMemo, useState } from 'react'
import { playSound, speak } from '../lib/audio'
import type { MiniGameProps } from './types'

type PieceKind = 'skull' | 'spine' | 'ribs' | 'leg' | 'tail'

interface PieceDefinition {
  id: PieceKind
  label: string
  x: string
  y: string
}

const definitions: PieceDefinition[] = [
  { id: 'tail', label: '尾部', x: '18%', y: '39%' },
  { id: 'spine', label: '脊椎', x: '46%', y: '33%' },
  { id: 'skull', label: '头骨', x: '78%', y: '25%' },
  { id: 'ribs', label: '肋骨', x: '53%', y: '56%' },
  { id: 'leg', label: '腿骨', x: '67%', y: '77%' }
]

const pieceCountByLevel = { 1: 3, 2: 4, 3: 5 }
const rotationSets: Record<1 | 2 | 3, number[]> = {
  1: [0, 0, 0, 0, 0],
  2: [90, 180, 270, 90, 0],
  3: [180, 90, 270, 180, 90]
}

function FossilGlyph({ kind }: { kind: PieceKind }) {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" className="fossil-glyph">
      {kind === 'skull' && (
        <>
          <path d="M24 29C30 10 70 7 91 24c12 10 8 31-7 37-8 3-18 1-26 3l-12 10-7-15c-15-5-21-17-15-30Z" />
          <circle cx="69" cy="31" r="8" />
          <path d="M79 51l15 5M53 56l4 13M69 55l3 11" />
        </>
      )}
      {kind === 'spine' && (
        <>
          <path d="M13 44C37 24 79 25 108 40" />
          {[24, 40, 56, 72, 88].map((x) => <circle key={x} cx={x} cy={36 - Math.abs(56 - x) / 8} r="7" />)}
          <path d="M31 37v18M48 33v20M65 32v21M82 34v19" />
        </>
      )}
      {kind === 'ribs' && (
        <>
          <path d="M27 18c-3 29 6 44 31 52M45 14c-3 31 5 48 24 58M63 14c0 30 6 45 18 55M81 18c2 23 7 37 16 45" />
          <path d="M22 18c26 9 50 9 74 0" />
        </>
      )}
      {kind === 'leg' && (
        <>
          <path d="M39 11l13 29-9 23M52 40l25-6 9 28M43 63l-20 8M86 62l17 8" />
          <circle cx="39" cy="11" r="7" /><circle cx="52" cy="40" r="6" /><circle cx="77" cy="34" r="6" />
        </>
      )}
      {kind === 'tail' && (
        <>
          <path d="M105 24C76 20 53 26 34 42 21 52 14 61 8 71" />
          <path d="M101 35C74 30 57 35 40 49" />
          {[88, 73, 58, 44, 31].map((x, index) => <circle key={x} cx={x} cy={27 + index * 5} r={8 - index * 0.7} />)}
        </>
      )}
    </svg>
  )
}

export function FossilGame({ level, soundEnabled, voiceEnabled, onComplete }: MiniGameProps) {
  const pieces = useMemo(() => definitions.slice(0, pieceCountByLevel[level]), [level])
  const [rotations, setRotations] = useState<Record<string, number>>(() =>
    Object.fromEntries(pieces.map((piece, index) => [piece.id, rotationSets[level][index]]))
  )
  const [selected, setSelected] = useState<PieceKind | null>(null)
  const [placed, setPlaced] = useState<PieceKind[]>([])
  const [message, setMessage] = useState('先选一块化石')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    speak(level === 1 ? '先选一块化石，再点它相同形状的位置' : '选中化石，转到正确方向，再放进相同的轮廓', voiceEnabled)
  }, [level, voiceEnabled])

  function selectPiece(id: PieceKind) {
    if (placed.includes(id) || finished) return
    setSelected(id)
    setMessage(level > 1 && rotations[id] !== 0 ? '方向不一样，先转一转' : '找到相同轮廓，放进去吧')
    playSound('tap', soundEnabled)
  }

  function rotatePiece() {
    if (!selected) {
      setMessage('先选一块化石，再来旋转')
      return
    }
    setRotations((current) => ({ ...current, [selected]: (current[selected] + 90) % 360 }))
    setMessage('转了四分之一圈')
    playSound('tap', soundEnabled)
  }

  function placePiece(slotId: PieceKind) {
    if (!selected || finished) {
      setMessage('先从下面选一块化石')
      return
    }
    if (selected !== slotId) {
      setMessage('边缘对不上，换一个轮廓试试')
      playSound('try-again', soundEnabled)
      return
    }
    if ((rotations[selected] ?? 0) % 360 !== 0) {
      setMessage('形状找对了，方向还要再转一转')
      playSound('try-again', soundEnabled)
      return
    }

    const nextPlaced = [...placed, selected]
    setPlaced(nextPlaced)
    setSelected(null)
    setMessage(nextPlaced.length === pieces.length ? '骨架修复完成！' : '放对了，继续修复吧')
    playSound('correct', soundEnabled)
    if (nextPlaced.length === pieces.length) {
      setFinished(true)
      window.setTimeout(onComplete, 900)
    }
  }

  return (
    <div className="mini-game fossil-game">
      <div className="fossil-workbench">
        <div className="fossil-board" aria-label="恐龙化石修复板">
          <svg className="skeleton-guide" viewBox="0 0 700 380" aria-hidden="true">
            <path d="M90 195c90-70 184-103 310-74 62 15 101 4 148-31 38-28 87-21 105 13 18 33-8 70-52 76-34 5-65-7-97-1-22 4-37 17-48 37-29 54-71 84-130 87-73 4-135-33-166-92-25 4-47 0-70-15Z" />
            <path d="M187 219l-37 113m160-85-12 94m108-116 29 105" />
          </svg>
          {pieces.map((piece) => {
            const isPlaced = placed.includes(piece.id)
            return (
              <button
                type="button"
                key={piece.id}
                className={`fossil-slot ${isPlaced ? 'is-filled' : ''}`}
                style={{ left: piece.x, top: piece.y }}
                onClick={() => placePiece(piece.id)}
                aria-label={`${piece.label}${isPlaced ? '已放好' : '轮廓'}`}
              >
                <FossilGlyph kind={piece.id} />
              </button>
            )
          })}
          <span className="board-tag">化石修复台</span>
        </div>

        <div className="fossil-controls">
          <p className={`game-message ${message.includes('完成') || message.includes('放对') ? 'is-success' : ''}`} aria-live="polite">{message}</p>
          {level > 1 && (
            <button type="button" className="rotate-button" onClick={rotatePiece} disabled={!selected}>
              ↻ 转一转
            </button>
          )}
        </div>

        <div className="fossil-tray" aria-label="待修复化石">
          {pieces.map((piece) => {
            if (placed.includes(piece.id)) return <div key={piece.id} className="fossil-piece-placeholder">✓</div>
            return (
              <button
                type="button"
                key={piece.id}
                className={`fossil-piece ${selected === piece.id ? 'is-selected' : ''}`}
                onClick={() => selectPiece(piece.id)}
                aria-pressed={selected === piece.id}
              >
                <span style={{ transform: `rotate(${rotations[piece.id]}deg)` }}>
                  <FossilGlyph kind={piece.id} />
                </span>
                <small>{piece.label}</small>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
