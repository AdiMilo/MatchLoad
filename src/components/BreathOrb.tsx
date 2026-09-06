import { useEffect, useState } from 'react'

export function BreathOrb({
  drivenPhase,
  drivenLabel,
  auto = true,
}: {
  drivenPhase?: 'in' | 'hold' | 'out'
  drivenLabel?: string
  auto?: boolean
}) {
  const [local, setLocal] = useState<{ phase: 'in' | 'hold' | 'out'; label: string }>({
    phase: 'in',
    label: 'Inhale  4',
  })

  useEffect(() => {
    if (!auto || drivenPhase) return
    const started = performance.now()
    const id = window.setInterval(() => {
      const t = (performance.now() - started) % 4000
      if (t < 1600) setLocal({ phase: 'in', label: 'Inhale  4' })
      else if (t < 2200) setLocal({ phase: 'hold', label: 'Hold' })
      else setLocal({ phase: 'out', label: 'Exhale  4' })
    }, 80)
    return () => window.clearInterval(id)
  }, [auto, drivenPhase])

  const phase = drivenPhase ?? local.phase
  const label = drivenLabel ?? local.label

  return (
    <div className={`breath breath-${phase}`}>
      <div className="breath-ring" />
      <div className="breath-core">
        <span className="breath-kicker">Queue reset</span>
        <span className="breath-label">{label}</span>
      </div>
    </div>
  )
}
