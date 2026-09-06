import { ClutchGauge } from '../components/ClutchGauge.tsx'
import { PhaseRail } from '../components/PhaseRail.tsx'
import { EventLog } from '../components/EventLog.tsx'
import { GameBackdrop } from '../components/GameBackdrop.tsx'
import { ScoreCards } from '../components/ScoreCards.tsx'
import { StatusChip } from '../components/StatusChip.tsx'
import { formatClock, loadTone } from '../lib/format.ts'
import type { SessionView } from '../types.ts'

export function SessionScreen({
  view,
  mode,
  onSkipPhase,
  onSkipRecap,
  onBetween,
  onEnd,
}: {
  view: SessionView
  mode: 'demo' | 'live'
  onSkipPhase?: () => void
  onSkipRecap?: () => void
  onBetween?: () => void
  onEnd?: () => void
}) {
  return (
    <div className={`screen session ${view.overlayQuiet ? 'session-quiet' : ''}`}>
      <GameBackdrop quiet={view.overlayQuiet} spike={view.spikeActive} />

      <header className="overlay-top">
        <div className="chip-row">
          {view.chips.map((chip) => (
            <StatusChip
              key={chip}
              tone={
                chip.includes('hot') || chip.includes('Tremor')
                  ? 'hot'
                  : chip.includes('quiet') || chip.includes('lock')
                    ? 'ok'
                    : 'idle'
              }
            >
              {chip}
            </StatusChip>
          ))}
        </div>
        <p className="clock">{formatClock(view.elapsedMs)}</p>
      </header>

      <div className="overlay-hero">
        <p className="match-line">
          {mode === 'demo' ? 'Rahul · BGMI session' : 'Live-ish · this device'}
        </p>
        <ClutchGauge
          value={view.scores.clutch}
          spike={view.spikeActive}
          size={188}
        />
        <p className={`status-line status-${loadTone(view.scores.clutch)}`}>
          {view.status}
        </p>
        {view.pitchDeg != null && (
          <p className="pitch-line">
            Pitch {view.pitchDeg}°
            {view.pitchDeg < 36 ? ' · flexed-neck zone' : ' · clearer line of sight'}
          </p>
        )}
      </div>

      <ScoreCards scores={view.scores} />
      <EventLog lines={view.log} />

      {view.sensorNote && <p className="sensor-note">{view.sensorNote}</p>}

      {mode === 'demo' && <PhaseRail phase={view.phase} elapsedMs={view.elapsedMs} />}

      <footer className="overlay-actions">
        {mode === 'demo' ? (
          <>
            <button type="button" className="btn btn-ghost btn-small" onClick={onSkipPhase}>
              Skip phase
            </button>
            <button type="button" className="btn btn-ghost btn-small" onClick={onSkipRecap}>
              Jump to recap
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-primary btn-small" onClick={onBetween}>
              Between rounds
            </button>
            <button type="button" className="btn btn-ghost btn-small" onClick={onEnd}>
              End session
            </button>
          </>
        )}
      </footer>
    </div>
  )
}
