import { loadTone } from '../lib/format.ts'
import type { Scores } from '../types.ts'

const ITEMS: { key: keyof Scores; label: string; hint: string }[] = [
  { key: 'tremor', label: 'Tremor / Grip', hint: 'Micro-tremor + death-grip' },
  { key: 'posture', label: 'Posture-time', hint: 'Flexed pitch minutes' },
  { key: 'recovery', label: 'Recovery HR', hint: 'Between-round load' },
]

export function ScoreCards({ scores }: { scores: Scores }) {
  return (
    <div className="score-grid">
      {ITEMS.map((item) => {
        const value = scores[item.key]
        const tone = loadTone(value)
        return (
          <article key={item.key} className={`score-card score-${tone}`}>
            <p className="score-label">{item.label}</p>
            <p className="score-value">{value}</p>
            <div className="score-bar" aria-hidden="true">
              <span style={{ width: `${value}%` }} />
            </div>
            <p className="score-hint">{item.hint}</p>
          </article>
        )
      })}
    </div>
  )
}
