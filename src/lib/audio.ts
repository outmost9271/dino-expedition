import { voiceManifest } from '../data/voiceManifest'

export type SoundName = 'tap' | 'correct' | 'try-again' | 'stamp'

let audioContext: AudioContext | null = null
let activeVoiceElement: HTMLAudioElement | null = null
let voiceRequestId = 0

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext
  if (!AudioContextClass) return null
  audioContext ??= new AudioContextClass()
  return audioContext
}

async function resumeAudio(context: AudioContext): Promise<boolean> {
  try {
    if (context.state === 'suspended') await context.resume()
    return context.state === 'running'
  } catch {
    return false
  }
}

export function playSound(name: SoundName, enabled: boolean): void {
  const context = getAudioContext()
  if (!context) return

  // 即使关闭音效，也在真实点击时解锁音频环境，保证随后自动播放任务语音。
  void resumeAudio(context)
  if (!enabled) return

  const sequences: Record<SoundName, Array<[number, number, number]>> = {
    tap: [[420, 0, 0.05]],
    correct: [[523, 0, 0.08], [659, 0.09, 0.08], [784, 0.18, 0.12]],
    'try-again': [[280, 0, 0.08], [240, 0.1, 0.1]],
    stamp: [[392, 0, 0.08], [523, 0.08, 0.08], [659, 0.16, 0.16]]
  }

  for (const [frequency, delay, duration] of sequences[name]) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = context.currentTime + delay
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.08, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }
}

export function speak(text: string, enabled: boolean): void {
  const requestId = ++voiceRequestId
  activeVoiceElement?.pause()
  activeVoiceElement = null
  if (!enabled || typeof Audio === 'undefined') return

  const url = voiceManifest[text]
  if (!url) return

  const audio = new Audio(url)
  audio.preload = 'auto'
  audio.volume = 0.92
  audio.onended = () => {
    if (activeVoiceElement === audio) activeVoiceElement = null
  }
  activeVoiceElement = audio

  void audio.play().then(() => {
    if (requestId !== voiceRequestId) {
      audio.pause()
      audio.currentTime = 0
    }
  }).catch(() => {
    if (activeVoiceElement === audio) activeVoiceElement = null
  })
}

export function stopSpeaking(): void {
  voiceRequestId += 1
  activeVoiceElement?.pause()
  if (activeVoiceElement) activeVoiceElement.currentTime = 0
  activeVoiceElement = null
}
