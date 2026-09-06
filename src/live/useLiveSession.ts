import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { pulseBreathe } from '../lib/haptics.ts'
import { clamp } from '../lib/format.ts'
import { liveRecap, recoveryFromHr, scoresOf } from '../lib/scoring.ts'
import type { RecapData, SessionView } from '../types.ts'

type MotionPermission = 'idle' | 'granted' | 'denied' | 'unsupported'

interface LiveState {
  tremor: number
  pitchDeg: number | null
  flexedSeconds: number
  landscapeSeconds: number
  spikes: number
  permission: MotionPermission
  gotMotion: boolean
}

const initialLive: LiveState = {
  tremor: 14,
  pitchDeg: null,
  flexedSeconds: 0,
  landscapeSeconds: 0,
  spikes: 0,
  permission: 'idle',
  gotMotion: false,
}

async function requestMotion(): Promise<MotionPermission> {
  const motion = DeviceMotionEvent as unknown as {
    requestPermission?: () => Promise<string>
  }
  const orientation = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>
  }

  try {
    if (typeof motion.requestPermission === 'function') {
      const result = await motion.requestPermission()
      if (result !== 'granted') return 'denied'
    }
    if (typeof orientation.requestPermission === 'function') {
      const result = await orientation.requestPermission()
      if (result !== 'granted') return 'denied'
    }
    return 'granted'
  } catch {
    return 'denied'
  }
}

export function useLiveSession(opts: {
  running: boolean
  between: boolean
  ppgDone: boolean
  hrPost: number | null
  onNeedRecap: (data: RecapData) => void
}): {
  view: SessionView
  requestSensors: () => Promise<void>
  finish: () => void
} {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [live, setLive] = useState<LiveState>(initialLive)
  const startRef = useRef<number | null>(null)
  const magBuf = useRef<number[]>([])
  const lastSpikeAt = useRef(0)
  const pitchBuf = useRef<number[]>([])
  const liveRef = useRef(live)
  const hrPre = useRef<number | null>(null)
  const onNeedRecapRef = useRef(opts.onNeedRecap)

  useEffect(() => {
    liveRef.current = live
  }, [live])

  useEffect(() => {
    onNeedRecapRef.current = opts.onNeedRecap
  }, [opts.onNeedRecap])

  useEffect(() => {
    if (!opts.running) {
      startRef.current = null
      magBuf.current = []
      pitchBuf.current = []
      lastSpikeAt.current = 0
      hrPre.current = null
      setElapsedMs(0)
      setLive(initialLive)
      return
    }
    let raf = 0
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now
      setElapsedMs(now - startRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [opts.running])

  useEffect(() => {
    if (!opts.running) return
    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity
      if (!acc) return
      const mag = Math.hypot(acc.x ?? 0, acc.y ?? 0, acc.z ?? 0)
      const buf = magBuf.current
      buf.push(mag)
      if (buf.length > 24) buf.shift()
      const mean = buf.reduce((s, n) => s + n, 0) / buf.length
      const variance =
        buf.reduce((s, n) => s + (n - mean) * (n - mean), 0) / buf.length
      const tremor = clamp(Math.round(((Math.sqrt(variance) - 0.04) / 1.15) * 100))
      setLive((prev) => {
        let spikes = prev.spikes
        if (tremor >= 72 && prev.tremor < 68 && performance.now() - lastSpikeAt.current > 1600) {
          spikes += 1
          lastSpikeAt.current = performance.now()
        }
        return { ...prev, tremor, spikes, gotMotion: true }
      })
    }

    const onOrient = (event: DeviceOrientationEvent) => {
      const beta = event.beta
      if (beta == null) return
      const pitch = Math.abs(beta)
      pitchBuf.current.push(pitch)
      if (pitchBuf.current.length > 80) pitchBuf.current.shift()
      setLive((prev) => ({ ...prev, pitchDeg: Math.round(pitch), gotMotion: true }))
    }

    window.addEventListener('devicemotion', onMotion)
    window.addEventListener('deviceorientation', onOrient)
    return () => {
      window.removeEventListener('devicemotion', onMotion)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [opts.running])

  useEffect(() => {
    if (!opts.running) return
    const id = window.setInterval(() => {
      setLive((prev) => {
        const flexed = prev.pitchDeg != null && prev.pitchDeg < 36
        return {
          ...prev,
          flexedSeconds: prev.flexedSeconds + (flexed ? 0.25 : 0),
          landscapeSeconds: prev.landscapeSeconds + 0.25,
        }
      })
    }, 250)
    return () => window.clearInterval(id)
  }, [opts.running])

  useEffect(() => {
    if (!opts.between) return
    const id = window.setInterval(() => {
      pulseBreathe()
    }, 4000)
    pulseBreathe()
    return () => window.clearInterval(id)
  }, [opts.between])

  const requestSensors = useCallback(async () => {
    const motionKnown = typeof DeviceMotionEvent !== 'undefined'
    if (!motionKnown) {
      setLive((prev) => ({ ...prev, permission: 'unsupported' }))
      return
    }
    const permission = await requestMotion()
    setLive((prev) => ({ ...prev, permission }))
  }, [])

  useEffect(() => {
    if (hrPre.current == null && opts.hrPost != null) {
      hrPre.current = Math.min(118, opts.hrPost + 12)
    }
  }, [opts.hrPost])

  const finish = useCallback(() => {
    const meanPitch =
      pitchBuf.current.length > 0
        ? pitchBuf.current.reduce((s, n) => s + n, 0) / pitchBuf.current.length
        : liveRef.current.pitchDeg
    onNeedRecapRef.current(
      liveRecap({
        spikes: liveRef.current.spikes,
        flexedSeconds: liveRef.current.flexedSeconds,
        landscapeSeconds: liveRef.current.landscapeSeconds,
        hrPre: hrPre.current,
        hrPost: opts.hrPost,
        meanPitch,
      }),
    )
  }, [opts.hrPost])

  const view = useMemo((): SessionView => {
    const sessionMin = Math.max(elapsedMs / 60000, 0.15)
    const posture = clamp(Math.round((live.flexedSeconds / 60 / sessionMin) * 70 + (live.pitchDeg != null && live.pitchDeg < 36 ? 20 : 8)))
    const recovery = recoveryFromHr(opts.hrPost)
    const scores = scoresOf(live.tremor, posture, recovery)
    const sensorsOn = live.gotMotion
    const noSensors =
      live.permission === 'denied' ||
      live.permission === 'unsupported' ||
      (live.permission === 'granted' && elapsedMs > 2500 && !live.gotMotion)

    return {
      screen: opts.between ? 'between' : 'session',
      phase: opts.between ? (opts.ppgDone ? 'ppg' : 'queue') : 'early',
      betweenStage: opts.ppgDone ? 'ppg' : 'breathe',
      scores,
      status: sensorsOn
        ? live.tremor >= 70
          ? 'Live motion · grip load high'
          : live.pitchDeg != null && live.pitchDeg < 36
            ? 'Live pitch · flexed-neck zone'
            : 'Live motion · overlay idle'
        : noSensors
          ? 'No motion sensors — scores stay near baseline'
          : live.permission === 'granted'
            ? 'Listening for motion…'
            : 'Waiting for motion permission',
      chips: [
        'Landscape lock',
        sensorsOn ? 'Live motion' : 'Live-ish fallback',
        `${live.spikes} spikes`,
      ],
      spikeActive: live.tremor >= 72,
      overlayQuiet: live.tremor < 28 && !opts.between,
      elapsedMs,
      phaseProgress: 0,
      breathPhase: 'in',
      breathLabel: 'Inhale  4',
      ppgProgress: 0,
      hrLive: opts.hrPost,
      log: [
        sensorsOn
          ? `Pitch ${live.pitchDeg ?? '—'}° · tremor ${live.tremor}`
          : 'Mac/iOS without motion — use Between rounds or the Rahul demo',
        `${live.spikes} clutch spikes this session`,
        `Flexed pitch ${Math.round(live.flexedSeconds)}s`,
      ],
      pitchDeg: live.pitchDeg,
      motionReady: sensorsOn,
      sensorNote: noSensors
        ? 'Motion permission was blocked or unavailable. Between-round PPG still works. The Rahul demo is the judged story.'
        : sensorsOn
          ? 'Using device pitch + motion magnitude as a light tremor/posture proxy. Not a clinical reading.'
          : 'On iPhone Safari, tap Allow when asked for motion access.',
    }
  }, [elapsedMs, live, opts.between, opts.hrPost, opts.ppgDone])

  return { view, requestSensors, finish }
}
