import { Disclaimer } from '../components/Disclaimer.tsx'
import { ClutchGauge } from '../components/ClutchGauge.tsx'

export function HomeScreen({
  onDemo,
  onLive,
}: {
  onDemo: () => void
  onLive: () => void
}) {
  return (
    <div className="screen home">
      <header className="topbar">
        <span className="brand-mark">ML</span>
        <div>
          <p className="brand">MatchLoad</p>
          <p className="brand-sub">iQOO HealthTech · wellness / ergonomics</p>
        </div>
      </header>

      <section className="hero">
        <ClutchGauge value={64} size={196} caption="This session" />
        <h1 className="hero-tagline">
          Measuring in-match gaming load — so peak performance lasts longer than
          one clutch round.
        </h1>
        <p className="lede">
          MatchLoad reads gaming musculoskeletal load and arousal while you
          play — tremor / death-grip, flexed-neck minutes, then a 15s recovery
          check between rounds. Not a next-morning report.
        </p>
      </section>

      <div className="cta-stack">
        <button type="button" className="btn btn-primary" onClick={onDemo}>
          Run Rahul&apos;s BGMI demo
        </button>
        <button type="button" className="btn btn-ghost" onClick={onLive}>
          Start live-ish session
        </button>
        <p className="cta-note">
          Demo needs no sensors. Works in Chrome on Mac and Safari on iPhone.
        </p>
      </div>

      <section className="beats">
        <h2>68-second judged story</h2>
        <ol>
          <li>
            <strong>Firefight</strong>
            <span>Death-grip tremor spikes on the overlay</span>
          </li>
          <li>
            <strong>Quiet mid-round</strong>
            <span>HUD dims while Rahul loots</span>
          </li>
          <li>
            <strong>Queue haptic</strong>
            <span>Paced breathe — vibrates where the API exists</span>
          </li>
          <li>
            <strong>15s PPG</strong>
            <span>Finger-on-lens capture → HR 94 → 81</span>
          </li>
          <li>
            <strong>Recap</strong>
            <span>4 spikes · 6.4 min bad pitch · one tip</span>
          </li>
        </ol>
      </section>

      <section className="signals">
        <h2>Signals (simulated in demo)</h2>
        <ul>
          <li>High-rate gyro / accel → micro-tremor and death-grip spikes</li>
          <li>Device pitch → turtle-neck / flexed posture minutes</li>
          <li>Rear camera + flash PPG, 15s between rounds</li>
          <li>Haptic motor → short paced-breathe in matchmaking</li>
        </ul>
      </section>

      <Disclaimer />
    </div>
  )
}
