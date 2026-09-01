export interface MiniGameProps {
  level: 1 | 2 | 3
  soundEnabled: boolean
  voiceEnabled: boolean
  onComplete: () => void
}
