import Phaser from 'phaser'
import { useEffect, useRef, useState } from 'react'
import { playSound, speak } from '../lib/audio'
import type { MiniGameProps } from './types'

type Direction = 'up' | 'down' | 'left' | 'right'
interface Cell { x: number; y: number }
interface RouteConfig {
  size: number
  start: Cell
  goal: Cell
  obstacles: Cell[]
  maxCommands: number
}

const routeConfigs: Record<1 | 2 | 3, RouteConfig> = {
  1: { size: 3, start: { x: 0, y: 2 }, goal: { x: 2, y: 0 }, obstacles: [], maxCommands: 5 },
  2: { size: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 0 }, obstacles: [{ x: 1, y: 2 }, { x: 2, y: 1 }], maxCommands: 7 },
  3: { size: 5, start: { x: 0, y: 4 }, goal: { x: 4, y: 0 }, obstacles: [{ x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 1 }], maxCommands: 9 }
}

const directionMeta: Record<Direction, { arrow: string; label: string; dx: number; dy: number }> = {
  up: { arrow: '↑', label: '向上', dx: 0, dy: -1 },
  down: { arrow: '↓', label: '向下', dx: 0, dy: 1 },
  left: { arrow: '←', label: '向左', dx: -1, dy: 0 },
  right: { arrow: '→', label: '向右', dx: 1, dy: 0 }
}

class ExpeditionRouteScene extends Phaser.Scene {
  private route: RouteConfig
  private dino!: Phaser.GameObjects.Container
  private current: Cell
  private readonly margin = 70
  private readonly boardSize = 380
  private onRouteResult: (success: boolean) => void
  private moving = false

  constructor(route: RouteConfig, onRouteResult: (success: boolean) => void) {
    super({ key: 'ExpeditionRoute' })
    this.route = route
    this.current = { ...route.start }
    this.onRouteResult = onRouteResult
  }

  create() {
    this.cameras.main.setBackgroundColor('#f5edda')
    this.drawBoard()
    this.dino = this.createDino()
    const start = this.cellCenter(this.route.start)
    this.dino.setPosition(start.x, start.y)
    this.game.events.on('run-route', this.runRoute, this)
    this.game.events.on('reset-route', this.resetRoute, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('run-route', this.runRoute, this)
      this.game.events.off('reset-route', this.resetRoute, this)
    })
  }

  private drawBoard() {
    const graphics = this.add.graphics()
    const cellSize = this.boardSize / this.route.size
    graphics.fillStyle(0xffffff, 0.72)
    graphics.fillRoundedRect(this.margin - 12, 18, this.boardSize + 24, this.boardSize + 24, 28)

    for (let y = 0; y < this.route.size; y += 1) {
      for (let x = 0; x < this.route.size; x += 1) {
        const px = this.margin + x * cellSize
        const py = 30 + y * cellSize
        graphics.fillStyle((x + y) % 2 === 0 ? 0xdcebd8 : 0xcfe2ca, 1)
        graphics.fillRoundedRect(px + 3, py + 3, cellSize - 6, cellSize - 6, 15)
      }
    }

    for (const obstacle of this.route.obstacles) {
      const center = this.cellCenter(obstacle)
      graphics.fillStyle(0x8c8070, 1)
      graphics.fillCircle(center.x - 12, center.y + 5, 24)
      graphics.fillStyle(0xa99b88, 1)
      graphics.fillCircle(center.x + 12, center.y + 3, 29)
      graphics.fillStyle(0xc4b6a0, 0.8)
      graphics.fillCircle(center.x + 3, center.y - 10, 14)
    }

    const goal = this.cellCenter(this.route.goal)
    graphics.lineStyle(7, 0x5b4a3d, 1)
    graphics.lineBetween(goal.x - 18, goal.y + 30, goal.x - 18, goal.y - 28)
    graphics.fillStyle(0xe1694f, 1)
    graphics.fillTriangle(goal.x - 15, goal.y - 28, goal.x + 28, goal.y - 13, goal.x - 15, goal.y + 2)
    graphics.fillStyle(0xf4c453, 1)
    graphics.fillCircle(goal.x - 18, goal.y - 33, 6)
  }

  private createDino() {
    const container = this.add.container(0, 0)
    const shadow = this.add.ellipse(0, 25, 62, 18, 0x173f37, 0.16)
    const tail = this.add.triangle(-33, 4, 0, 9, 37, 0, 32, 20, 0x2d8b68)
    const body = this.add.ellipse(0, 0, 58, 44, 0x2d8b68)
    const head = this.add.circle(23, -17, 19, 0x42a878)
    const eye = this.add.circle(29, -22, 3.5, 0x173f37)
    const leg1 = this.add.rectangle(-12, 21, 10, 26, 0x256f58)
    const leg2 = this.add.rectangle(13, 21, 10, 26, 0x256f58)
    container.add([shadow, tail, leg1, leg2, body, head, eye])
    container.setDepth(5)
    return container
  }

  private cellCenter(cell: Cell) {
    const cellSize = this.boardSize / this.route.size
    return {
      x: this.margin + cell.x * cellSize + cellSize / 2,
      y: 30 + cell.y * cellSize + cellSize / 2
    }
  }

  private isObstacle(cell: Cell) {
    return this.route.obstacles.some((obstacle) => obstacle.x === cell.x && obstacle.y === cell.y)
  }

  private isValid(cell: Cell) {
    return cell.x >= 0 && cell.y >= 0 && cell.x < this.route.size && cell.y < this.route.size && !this.isObstacle(cell)
  }

  private runRoute(commands: Direction[]) {
    if (this.moving || commands.length === 0) return
    this.moving = true
    this.current = { ...this.route.start }
    const start = this.cellCenter(this.current)
    this.dino.setPosition(start.x, start.y)

    const moveAt = (index: number) => {
      if (index >= commands.length) {
        this.moving = false
        const success = this.current.x === this.route.goal.x && this.current.y === this.route.goal.y
        this.onRouteResult(success)
        if (!success) this.cameras.main.shake(160, 0.006)
        return
      }

      const meta = directionMeta[commands[index]]
      const next = { x: this.current.x + meta.dx, y: this.current.y + meta.dy }
      if (!this.isValid(next)) {
        this.moving = false
        this.tweens.add({ targets: this.dino, x: this.dino.x - meta.dx * 12, y: this.dino.y - meta.dy * 12, yoyo: true, duration: 110, repeat: 1 })
        this.cameras.main.shake(180, 0.007)
        this.time.delayedCall(420, () => this.onRouteResult(false))
        return
      }

      this.current = next
      const point = this.cellCenter(next)
      this.tweens.add({
        targets: this.dino,
        x: point.x,
        y: point.y,
        duration: 330,
        ease: 'Sine.InOut',
        onStart: () => this.tweens.add({ targets: this.dino, scaleY: 0.9, yoyo: true, duration: 150 }),
        onComplete: () => moveAt(index + 1)
      })
    }

    moveAt(0)
  }

  private resetRoute() {
    if (this.moving) return
    this.current = { ...this.route.start }
    const start = this.cellCenter(this.current)
    this.tweens.add({ targets: this.dino, x: start.x, y: start.y, duration: 250 })
  }
}

export default function RouteGame({ level, soundEnabled, voiceEnabled, onComplete }: MiniGameProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [commands, setCommands] = useState<Direction[]>([])
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('用箭头排好路线')
  const route = routeConfigs[level]

  useEffect(() => {
    speak('观察起点、岩石和红旗，先排好整条路线，再按出发', voiceEnabled)
  }, [level, voiceEnabled])

  useEffect(() => {
    if (!parentRef.current) return
    const scene = new ExpeditionRouteScene(route, (success) => {
      setRunning(false)
      if (success) {
        setMessage('顺利到达观察站！')
        playSound('correct', soundEnabled)
        window.setTimeout(onComplete, 900)
      } else {
        setMessage('这条路还没到红旗，调整一下吧')
        playSound('try-again', soundEnabled)
      }
    })
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: parentRef.current,
      width: 520,
      height: 440,
      transparent: false,
      scene,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: { antialias: true, pixelArt: false }
    })
    gameRef.current = game
    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [level, onComplete, route, soundEnabled])

  function addCommand(direction: Direction) {
    if (running || commands.length >= route.maxCommands) return
    setCommands((current) => [...current, direction])
    setMessage('路线正在变完整')
    playSound('tap', soundEnabled)
  }

  function removeLast() {
    if (running) return
    setCommands((current) => current.slice(0, -1))
    setMessage('拿掉了最后一步')
  }

  function clearRoute() {
    if (running) return
    setCommands([])
    setMessage('重新想一条路线吧')
    gameRef.current?.events.emit('reset-route')
  }

  function runRoute() {
    if (commands.length === 0 || running) {
      setMessage('先放入至少一个方向箭头')
      return
    }
    setRunning(true)
    setMessage('小恐龙出发啦！')
    gameRef.current?.events.emit('run-route', commands)
  }

  return (
    <div className="mini-game route-game">
      <div className="route-layout">
        <div className="phaser-route" ref={parentRef} aria-label="恐龙路线地图" />
        <div className="route-panel">
          <div>
            <span className="route-panel__eyebrow">路线指令</span>
            <h3>带小恐龙走到红旗</h3>
            <p>灰色岩石不能经过</p>
          </div>

          <div className="command-strip" aria-label="已经排列的指令">
            {commands.length === 0 && <small>方向箭头会放在这里</small>}
            {commands.map((direction, index) => (
              <span key={`${direction}-${index}`}>{directionMeta[direction].arrow}</span>
            ))}
          </div>

          <div className="direction-pad">
            {(Object.keys(directionMeta) as Direction[]).map((direction) => (
              <button
                type="button"
                key={direction}
                onClick={() => addCommand(direction)}
                disabled={running || commands.length >= route.maxCommands}
                aria-label={directionMeta[direction].label}
                className={`dir-${direction}`}
              >
                {directionMeta[direction].arrow}
              </button>
            ))}
          </div>

          <div className="route-edit-actions">
            <button type="button" onClick={removeLast} disabled={running || commands.length === 0}>退一步</button>
            <button type="button" onClick={clearRoute} disabled={running || commands.length === 0}>清空</button>
          </div>
          <button className="primary-button compact route-run" type="button" onClick={runRoute} disabled={running}>
            {running ? '正在前进…' : '出发'}
          </button>
        </div>
      </div>
      <p className={`game-message ${message.includes('到达') ? 'is-success' : ''}`} aria-live="polite">{message}</p>
    </div>
  )
}
