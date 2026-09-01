import { useEffect, useState } from 'react'
import { playSound } from '../lib/audio'
import { useGameStore } from '../store/gameStore'
import type { GameSettings } from '../types/game'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const settings = useGameStore((state) => state.settings)
  const updateSettings = useGameStore((state) => state.updateSettings)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (!open) setConfirmReset(false)
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  function setOption<Key extends keyof GameSettings>(key: Key, value: GameSettings[Key]) {
    updateSettings({ [key]: value })
    playSound('tap', key === 'sound' ? Boolean(value) : settings.sound)
  }

  async function doReset() {
    await resetProgress()
    setConfirmReset(false)
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <button type="button" className="modal-close" aria-label="关闭设置" onClick={onClose}>×</button>
        <div className="settings-heading">
          <span>⚙️</span>
          <div>
            <small>仅保存在这台设备</small>
            <h2 id="settings-title">家长设置</h2>
          </div>
        </div>

        <div className="setting-row">
          <div><strong>游戏音效</strong><small>正确、提示和盖章声音</small></div>
          <button
            type="button"
            className={`switch ${settings.sound ? 'is-on' : ''}`}
            aria-pressed={settings.sound}
            onClick={() => setOption('sound', !settings.sound)}
          ><span /></button>
        </div>

        <div className="setting-row">
          <div><strong>自然中文旁白</strong><small>使用统一、温和的儿童游戏语音</small></div>
          <button
            type="button"
            className={`switch ${settings.voice ? 'is-on' : ''}`}
            aria-pressed={settings.voice}
            onClick={() => setOption('voice', !settings.voice)}
          ><span /></button>
        </div>

        <div className="setting-block">
          <div className="setting-block__title">
            <strong>单次考察提醒</strong>
            <small>到时间后提示孩子休息眼睛</small>
          </div>
          <div className="duration-options">
            {([8, 10, 15] as const).map((minutes) => (
              <button
                type="button"
                key={minutes}
                className={settings.sessionMinutes === minutes ? 'is-selected' : ''}
                onClick={() => setOption('sessionMinutes', minutes)}
              >{minutes} 分钟</button>
            ))}
          </div>
        </div>

        <div className="privacy-note">
          <span>🛡️</span>
          <p><strong>无需账号，也没有广告</strong><br />进度只保存在当前浏览器，不上传姓名、照片或位置。</p>
        </div>

        <div className="reset-zone">
          {!confirmReset ? (
            <button type="button" className="text-button danger" onClick={() => setConfirmReset(true)}>重新开始全部考察</button>
          ) : (
            <div className="reset-confirm">
              <p>确定清除所有印章和关卡进度吗？</p>
              <button type="button" onClick={() => setConfirmReset(false)}>取消</button>
              <button type="button" className="danger-fill" onClick={() => void doReset()}>确定清除</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
