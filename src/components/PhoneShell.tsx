import type { ReactNode } from 'react'

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <div className="stage-glow" aria-hidden="true" />
      <div className="phone">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">{children}</div>
        <div className="phone-home" aria-hidden="true" />
      </div>
      <p className="stage-caption">
        MatchLoad · mobile-first prototype · Mac or iPhone
      </p>
    </div>
  )
}
