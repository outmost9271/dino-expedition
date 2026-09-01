import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PatternGame } from './PatternGame'

describe('规律游戏', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('完成三轮正确选择后结束任务', () => {
    const onComplete = vi.fn()
    render(
      <PatternGame
        level={1}
        soundEnabled={false}
        voiceEnabled={false}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByLabelText('选择🟠'))
    act(() => vi.advanceTimersByTime(800))
    fireEvent.click(screen.getByLabelText('选择▲'))
    act(() => vi.advanceTimersByTime(800))
    fireEvent.click(screen.getByLabelText('选择🌿'))
    act(() => vi.advanceTimersByTime(800))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('错误选择不会结束任务并显示温和提示', () => {
    const onComplete = vi.fn()
    render(
      <PatternGame
        level={1}
        soundEnabled={false}
        voiceEnabled={false}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByLabelText('选择🟢'))
    expect(screen.getByText('这一组还没接上，再从第一个开始看')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})
