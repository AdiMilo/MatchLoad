import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DEMO_RECAP_AT,
  PHASE_WINDOWS,
  PPG_SECONDS,
  RAHUL_RECAP,
  SPIKE_TIMES,
  breathAt,
  chipsFor,
  demoHrAt,
  demoScoresAt,
  logAt,
  phaseAt,
  phaseProgress,
  statusFor,
} from './script.ts'
import { pulseBreathe, pulseSpike } from '../lib/haptics.ts'
import type { RecapData, SessionView } from '../types.ts'

export function useDemoSession(opts: {
  running: boolean
  onRecap: (data: RecapData) => void
}): {
  view: SessionView
  skipPhase: () => void
  skipToRecap: () => void
  jumpTo: (ms: number) => void
} {
  const [elapsedMs, setElapsedMs] = useState(0)
  const startRef = useRef<number | null>(null)
  const recapSent = useRef(false)
  const lastSpike = useRef<number | null>(null)
  const lastBreathIn = useRef(-1)
  const onRecapRef = useRef(opts.onRecap)
  onRecapRef.current = opts.onRecap

  useEffect(() => {
    if (!opts.running) {
      startRef.current = null
      recapSent.current = false
      lastSpike.current = null
      lastBreathIn.current = -1
      setElapsedMs(0)
      return
    }

    let raf = 0
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now
      const elapsed = now - startRef.current
      setElapsedMs(elapsed)

      const spikeHit = SPIKE_TIMES.find((s) => Math.abs(elapsed - s) < 80)
      if (spikeHit != null && lastSpike.current !== spikeHit) {
        lastSpike.current = spikeHit
        pulseSpike()
      }

      if (elapsed >= PHASE_WINDOWS.queue[0] && elapsed < PHASE_WINDOWS.ppg[0]) {
        const cycle = Math.floor((elapsed - PHASE_WINDOWS.queue[0]) / 4000)
        const local = (elapsed - PHASE_WINDOWS.queue[0]) % 4000
        if (local < 120 && lastBreathIn.current !== cycle) {
          lastBreathIn.current = cycle
          pulseBreathe()
        }
      }

      if (elapsed >= DEMO_RECAP_AT && !recapSent.current) {
        recapSent.current = true
        onRecapRef.current(RAHUL_RECAP)
      }

      if (elapsed < DEMO_RECAP_AT + 400) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [opts.running])

  const skipPhase = () => {
    const phase = phaseAt(elapsedMs)
    const order = [
      'drop',
      'early',
      'firefight',
      'quiet',
      'queue',
      'ppg',
      'recap',
    ] as const
    const idx = order.indexOf(phase)
    const next = order[Math.min(order.length - 1, idx + 1)]
    const target = next === 'recap' ? DEMO_RECAP_AT : PHASE_WINDOWS[next][0]
    jumpTo(target)
  }

  const skipToRecap = () => {
    jumpTo(DEMO_RECAP_AT)
  }

  function jumpTo(ms: number) {
    const now = performance.now()
    startRef.current = now - ms
    setElapsedMs(ms)
    if (ms >= DEMO_RECAP_AT && !recapSent.current) {
      recapSent.current = true
      onRecapRef.current(RAHUL_RECAP)
    }
  }

  const view = useMemo((): SessionView => {
    const t = elapsedMs
    const phase = phaseAt(t)
    const spikeActive = SPIKE_TIMES.some((s) => Math.abs(t - s) < 700)
    const scores = demoScoresAt(t)
    const breath = breathAt(t)
    const ppgElapsed = t - PHASE_WINDOWS.ppg[0]
    const screen =
      phase === 'recap'
        ? 'recap'
        : phase === 'queue' || phase === 'ppg'
          ? 'between'
          : 'session'

    return {
      screen,
      phase,
      betweenStage: phase === 'ppg' ? 'ppg' : 'breathe',
      scores,
      status: statusFor(phase, spikeActive),
      chips: chipsFor(phase),
      spikeActive,
      overlayQuiet: phase === 'quiet',
      elapsedMs: t,
      phaseProgress: phaseProgress(phase, t),
      breathPhase: breath.phase,
      breathLabel: breath.label,
      ppgProgress: Math.min(1, Math.max(0, ppgElapsed / (PPG_SECONDS * 1000))),
      hrLive: demoHrAt(t),
      log: logAt(t),
      pitchDeg: phase === 'early' || phase === 'firefight' || phase === 'quiet' ? 24 : 41,
      motionReady: false,
      sensorNote: 'Scripted Rahul replay — no sensors required.',
    }
  }, [elapsedMs])

  return { view, skipPhase, skipToRecap, jumpTo }
}
