import { useEffect } from 'react'
import { BaseCamp } from './components/BaseCamp'
import { GameScreen } from './components/GameScreen'
import { WelcomeScreen } from './components/WelcomeScreen'
import { useGameStore } from './store/gameStore'

function LoadingScreen() {
  return (
    <main className="loading-screen">
      <div className="loading-mark">🦕</div>
      <div className="loading-track"><span /></div>
      <p>正在打开考察手册…</p>
    </main>
  )
}

export default function App() {
  const hydrated = useGameStore((state) => state.hydrated)
  const screen = useGameStore((state) => state.screen)
  const hydrate = useGameStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) return <LoadingScreen />
  if (screen === 'welcome') return <WelcomeScreen />
  if (screen === 'game') return <GameScreen />
  return <BaseCamp />
}
