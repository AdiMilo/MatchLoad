import { useEffect, useRef, useState } from 'react'

export function PpgCapture({
  running,
  progress,
  hrLive,
  useCamera,
  external = false,
  onComplete,
}: {
  running: boolean
  progress: number
  hrLive: number | null
  useCamera: boolean
  external?: boolean
  onComplete?: (hr: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [camOn, setCamOn] = useState(false)
  const [localProgress, setLocalProgress] = useState(0)
  const [localHr, setLocalHr] = useState<number | null>(null)
  const completed = useRef(false)

  const p = running && useCamera === false && progress > 0 ? progress : localProgress
  const hr = hrLive ?? localHr
  const secondsLeft = Math.max(0, Math.ceil(15 * (1 - p)))

  useEffect(() => {
    if (!useCamera || !running) return
    let stream: MediaStream | null = null
    let cancelled = false
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          void videoRef.current.play()
        }
        setCamOn(true)
      })
      .catch(() => setCamOn(false))
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [useCamera, running])

  useEffect(() => {
    if (!running) {
      setLocalProgress(0)
      setLocalHr(null)
      completed.current = false
      return
    }
    if (external) return
    const started = performance.now()
    const id = window.setInterval(() => {
      const next = Math.min(1, (performance.now() - started) / 15000)
      setLocalProgress(next)
      if (next >= 0.18) {
        setLocalHr(Math.round(94 - next * 13))
      }
      if (next >= 1 && !completed.current) {
        completed.current = true
        onComplete?.(81)
      }
    }, 80)
    return () => window.clearInterval(id)
  }, [running, progress, useCamera, onComplete, external])

  useEffect(() => {
    if (progress >= 1 && hrLive != null && !completed.current) {
      completed.current = true
      onComplete?.(hrLive)
    }
  }, [progress, hrLive, onComplete])

  const path = waveformPath(p)

  return (
    <div className="ppg">
      <div className={`ppg-viewfinder ${p > 0.08 && p < 1 ? 'ppg-live' : ''}`}>
        {camOn ? (
          <video ref={videoRef} className="ppg-video" muted playsInline autoPlay />
        ) : (
          <div className="ppg-fake-cam" />
        )}
        <div className="ppg-lens">
          <span className="ppg-flash" />
        </div>
        <p className="ppg-instruction">
          {p >= 1
            ? 'Capture complete'
            : 'Cover the rear camera with your fingertip'}
        </p>
        <p className="ppg-count">{p >= 1 ? '15.0s' : `${secondsLeft}s`}</p>
      </div>
      <svg className="ppg-wave" viewBox="0 0 300 64" aria-hidden="true">
        <path d={path} />
      </svg>
      <div className="ppg-hr">
        <span className="ppg-hr-kicker">Session HR (simulated)</span>
        <span className="ppg-hr-value">{hr ?? '—'}</span>
        <span className="ppg-hr-unit">not ECG · not SpO2 · not BP</span>
      </div>
    </div>
  )
}

function waveformPath(progress: number): string {
  const points: string[] = []
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 300
    const visible = i / 60 <= progress + 0.02
    const beat = Math.sin(i * 0.85) * 10 + Math.sin(i * 2.4) * 4
    const qrs = i % 8 === 0 ? -18 : 0
    const y = visible ? 32 + beat + qrs : 32
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(' ')
}
