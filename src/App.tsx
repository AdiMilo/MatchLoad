import { useCallback, useState } from 'react'
import { PhoneShell } from './components/PhoneShell.tsx'
import { PHASE_WINDOWS } from './demo/script.ts'
import { useDemoSession } from './demo/useDemoSession.ts'
import { useLiveSession } from './live/useLiveSession.ts'
import { BetweenRoundScreen } from './screens/BetweenRoundScreen.tsx'
import { HomeScreen } from './screens/HomeScreen.tsx'
import { RecapScreen } from './screens/RecapScreen.tsx'
import { SessionScreen } from './screens/SessionScreen.tsx'
import type { RecapData } from './types.ts'

type Route =
  | { name: 'home' }
  | { name: 'live' }
  | { name: 'recap'; data: RecapData }
export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' })
  const [demoKey, setDemoKey] = useState(0)
  const [liveBetween, setLiveBetween] = useState(false)
  const [livePpg, setLivePpg] = useState(false)
  const [liveHr, setLiveHr] = useState<number | null>(null)

  const goRecap = useCallback((data: RecapData) => {
    setRoute({ name: 'recap', data })
    setLiveBetween(false)
    setLivePpg(false)
  }, [])

  const demo = useDemoSession({
    running: route.name === 'demo',
    onRecap: goRecap,
  })

  const live = useLiveSession({
    running: route.name === 'live',
    between: liveBetween && !livePpg,
    ppgDone: livePpg,
    hrPost: liveHr,
    onNeedRecap: goRecap,
  })
    onNeedRecap: goRecap,
  })

  const startDemo = () => {
    setDemoKey((k) => k + 1)
    setRoute({ name: 'demo' })
  const startLive = () => {
    setLiveBetween(false)
    setLivePpg(false)
    setLiveBetween(false)
    setLivePpg(false)
    setLiveHr(null)
    void live.requestSensors()
    setRoute({ name: 'live' })
  }

  return (
    <PhoneShell>
      {route.name === 'home' && (
        <SessionScreen
          key={`demo-session-${demoKey}`}
          view={demo.view}
          mode="demo"
          onSkipPhase={demo.skipPhase}
          onSkipRecap={demo.skipToRecap}
        />
      )}
      {route.name === 'demo' && demo.view.screen === 'between' && (
        <BetweenRoundScreen
          view={demo.view}
          mode="demo"
          useCamera={false}
          onSkipToPpg={() => jumpDemo(demo, PHASE_WINDOWS.ppg[0])}
          onSkipRecap={demo.skipToRecap}
          view={demo.view}
          mode="demo"
          useCamera={false}
          onSkipToPpg={() => demo.jumpTo(PHASE_WINDOWS.ppg[0] + 40)}
          onSkipRecap={demo.skipToRecap}
        />
      )}
            setLiveBetween(true)
            setLivePpg(false)
          }}
          onEnd={live.finish}
        />
      )}

      {route.name === 'live' && liveBetween && (
        <BetweenRoundScreen
          view={{
            ...live.view,
            betweenStage: livePpg ? 'ppg' : 'breathe',
            screen: 'between',
          }}
          mode="live"
          useCamera
          onPpgComplete={(hr) => setLiveHr(hr)}
          onAdvanceLive={() => {
            if (!livePpg) {
              setLivePpg(true)
              return
            }
            live.finish()
          }}
        />
      )}

      {route.name === 'recap' && (
        <RecapScreen data={route.data} onHome={() => setRoute({ name: 'home' })} onReplay={startDemo} />
      )}
    </PhoneShell>
      )}

      {route.name === 'recap' && (
        <RecapScreen
          data={route.data}
          onHome={() => setRoute({ name: 'home' })}
          onReplay={startDemo}
        />
      )}
    </PhoneShell>
  )
}
