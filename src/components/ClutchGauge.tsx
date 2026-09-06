import { loadTone } from '../lib/format.ts'

export function ClutchGauge({
  value,
  spike = false,
  size = 212,
  caption = 'MatchLoad',
}: {
  value: number
  spike?: boolean
  size?: number
  caption?: string
}) {
  const r = 78
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(100, Math.max(0, value)) / 100)
  const tone = loadTone(value)

  return (
    <div
      className={`gauge ${spike ? 'gauge-spike' : ''} gauge-${tone}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="gauge-svg" aria-hidden="true">
        <circle className="gauge-track" cx="100" cy="100" r={r} />
        <circle
          className="gauge-arc"
          cx="100"
          cy="100"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2 - Math.PI / 2
          const inner = i % 3 === 0 ? 92 : 94
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * inner}
              y1={100 + Math.sin(a) * inner}
              x2={100 + Math.cos(a) * 97}
              y2={100 + Math.sin(a) * 97}
              className="gauge-tick"
            />
          )
        })}
      </svg>
      <div className="gauge-readout">
        <span className="gauge-kicker">{caption}</span>
        <span className="gauge-value">{Math.round(value)}</span>
        <span className="gauge-scale">0–100 session load</span>
      </div>
    </div>
  )
}
