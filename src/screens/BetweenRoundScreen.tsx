import { BreathOrb } from '../components/BreathOrb.tsx'
import { PhaseRail } from '../components/PhaseRail.tsx'
import { Disclaimer } from '../components/Disclaimer.tsx'
import { PpgCapture } from '../components/PpgCapture.tsx'
import { StatusChip } from '../components/StatusChip.tsx'
import { canVibrate } from '../lib/haptics.ts'
import type { SessionView } from '../types.ts'

export function BetweenRoundScreen({
  view,
  mode,
  useCamera,
  onPpgComplete,
  onSkipToPpg,
  onSkipRecap,
  onAdvanceLive,
}: {
  view: SessionView
  mode: 'demo' | 'live'
  useCamera: boolean
  onPpgComplete?: (hr: number) => void
  onSkipToPpg?: () => void
  onSkipRecap?: () => void
  onAdvanceLive?: () => void
}) {
  const breathe = view.betweenStage === 'breathe'

  return (
    <div className="screen between">
      <header className="topbar">
        <span className="brand-mark">ML</span>
        <div>
          <p className="brand">Between rounds</p>
          <p className="brand-sub">Reset before the next drop</p>
        </div>
      </header>

      <div className="chip-row">
        <StatusChip tone="ok">Queue</StatusChip>
        <StatusChip tone={canVibrate() ? 'ok' : 'idle'}>
          {canVibrate() ? 'Haptic on' : 'Visual pulse'}
        </StatusChip>
        <StatusChip tone="warn">{breathe ? 'Paced breathe' : 'PPG 15s'}</StatusChip>
      </div>

      {breathe ? (
        <>
          <BreathOrb
            drivenPhase={mode === 'demo' ? view.breathPhase : undefined}
            drivenLabel={mode === 'demo' ? view.breathLabel : undefined}
          />
          <p className="between-copy">
            Matchmaking is the only recovery window that actually fits a mobile
            match. Follow the pulse — three 4-count breaths, then a 15s
            finger-on-lens check.
          </p>
        </>
      ) : (
        <>
          <PpgCapture
            running
            progress={mode === 'demo' ? view.ppgProgress : 0}
            hrLive={mode === 'demo' ? view.hrLive : null}
            useCamera={useCamera}
            external={mode === 'demo'}
            onComplete={onPpgComplete}
          />
          <p className="between-copy">
            Rear camera + flash PPG is simulated here for the upload demo. A
            later Android build would use CameraX torch and a fingertip on the
            lens. Not ECG, BP, or medical SpO2.
          </p>
        </>
      )}

      <div className="cta-stack">
        {mode === 'demo' ? (
          <>
            {breathe && (
              <button type="button" className="btn btn-primary" onClick={onSkipToPpg}>
                Skip to 15s PPG
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onSkipRecap}>
              Jump to recap
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onAdvanceLive}>
            {breathe ? 'Start 15s PPG' : 'Finish recap'}
          </button>
        )}
      </div>

      {mode === 'demo' && <PhaseRail phase={view.phase} elapsedMs={view.elapsedMs} />}

      <Disclaimer compact />
    </div>
  )
}
