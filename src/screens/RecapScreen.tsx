import { Disclaimer } from '../components/Disclaimer.tsx'
import type { RecapData } from '../types.ts'

export function RecapScreen({
  data,
  onHome,
  onReplay,
}: {
  data: RecapData
  onHome: () => void
  onReplay: () => void
}) {
  const delta = data.recoveryDelta
  const deltaLabel =
    delta == null ? '—' : delta > 0 ? `+${delta}` : `${delta}`

  return (
    <div className="screen recap">
      <header className="topbar">
        <span className="brand-mark">ML</span>
        <div>
          <p className="brand">Session recap</p>
          <p className="brand-sub">
            {data.player} · {data.matchLabel}
          </p>
        </div>
      </header>

      <p className="recap-kicker">What this session cost the body</p>

      <div className="stat-stack">
        <article className="stat-card">
          <p className="stat-label">Clutch spikes</p>
          <p className="stat-value">{data.spikes}</p>
          <p className="stat-hint">Death-grip / tremor bursts during contact</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Minutes in bad pitch</p>
          <p className="stat-value">{data.postureMinutes.toFixed(1)}</p>
          <p className="stat-hint">
            Flexed-neck zone · {data.landscapeMinutes.toFixed(1)} min landscape lock
          </p>
        </article>
        <article className="stat-card stat-hr">
          <p className="stat-label">Recovery HR</p>
          <p className="stat-value">
            {data.hrPre ?? '—'}
            <span className="stat-arrow">→</span>
            {data.hrPost ?? '—'}
          </p>
          <p className="stat-hint">
            Delta {deltaLabel} bpm · finger-on-lens, not a medical reading
          </p>
        </article>
      </div>

      <article className="tip-card">
        <p className="tip-kicker">One tip for the next queue</p>
        <h2>{data.tip}</h2>
        <p>{data.tipWhy}</p>
      </article>

      <p className="session-note">{data.sessionNote}</p>

      <div className="cta-stack">
        <button type="button" className="btn btn-primary" onClick={onReplay}>
          Replay Rahul demo
        </button>
        <button type="button" className="btn btn-ghost" onClick={onHome}>
          Back home
        </button>
      </div>

      <Disclaimer compact />
    </div>
  )
}
