import { PHASE_WINDOWS } from '../demo/script.ts'
import type { DemoPhase } from '../types.ts'

const STOPS: { id: DemoPhase; label: string }[] = [
  { id: 'drop', label: 'Drop' },
  { id: 'early', label: 'Loot' },
  { id: 'firefight', label: 'Fight' },
  { id: 'quiet', label: 'Quiet' },
  { id: 'queue', label: 'Queue' },
  { id: 'ppg', label: 'PPG' },
]

export function PhaseRail({ phase, elapsedMs }: { phase: DemoPhase; elapsedMs: number }) {
  const total = PHASE_WINDOWS.recap[0]
  const pct = Math.min(100, (elapsedMs / total) * 100)
  return (
    <div className="phase-rail" aria-hidden="true">
      <div className="phase-rail-bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="phase-rail-stops">
        {STOPS.map((stop) => (
          <span
            key={stop.id}
            className={phase === stop.id || (phase === 'recap' && stop.id === 'ppg') ? 'is-now' : ''}
          >
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  )
}
