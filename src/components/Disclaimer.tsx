export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`disclaimer ${compact ? 'disclaimer-compact' : ''}`}>
      <p className="disclaimer-kicker">Wellness only</p>
      <p>
        MatchLoad is an ergonomics and recovery coach for play sessions. It
        does not diagnose any condition, and it does not measure blood pressure,
        ECG, medical SpO2, or disease. Numbers here are coaching cues — demo
        values are simulated; live-ish values are device-motion proxies.
      </p>
    </aside>
  )
}
