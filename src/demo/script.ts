import { lerp, smoothstep } from '../lib/format.ts'
import type { DemoPhase, RecapData, Scores } from '../types.ts'

export const PHASE_WINDOWS = {
  drop: [0, 4000],
  early: [4000, 12000],
  firefight: [12000, 28000],
  quiet: [28000, 38000],
  queue: [38000, 50000],
  ppg: [50000, 68000],
  recap: [68000, 68000],
} as const

export const DEMO_RECAP_AT = 68000
export const PPG_SECONDS = 15

export const SPIKE_TIMES = [13500, 16800, 21200, 25400]

export const RAHUL_RECAP: RecapData = {
  player: 'Rahul',
  matchLabel: 'BGMI · squad · night compound',
  spikes: 4,
  postureMinutes: 6.4,
  landscapeMinutes: 11.2,
  hrPre: 94,
  hrPost: 81,
  recoveryDelta: -13,
  tip: 'Tilt the phone up 15–20°.',
  tipWhy:
    'Pitch sat in a flexed-neck zone through most of the firefight. Raising the device for the next queue unloads the neck without leaving the lobby.',
  sessionNote:
    'Compressed ~12 min of play into a 68s replay. Signals are scripted for the upload demo — not a recording of a real match.',
}

interface NumericFrame {
  t: number
  tremor: number
  posture: number
  recovery: number
}

const FRAMES: NumericFrame[] = [
  { t: 0, tremor: 12, posture: 18, recovery: 30 },
  { t: 4000, tremor: 16, posture: 28, recovery: 32 },
  { t: 9000, tremor: 22, posture: 46, recovery: 36 },
  { t: 13000, tremor: 48, posture: 58, recovery: 42 },
  { t: 15500, tremor: 78, posture: 66, recovery: 50 },
  { t: 18000, tremor: 86, posture: 72, recovery: 56 },
  { t: 22000, tremor: 91, posture: 78, recovery: 62 },
  { t: 26000, tremor: 84, posture: 80, recovery: 64 },
  { t: 30000, tremor: 38, posture: 74, recovery: 58 },
  { t: 36000, tremor: 24, posture: 70, recovery: 52 },
  { t: 40000, tremor: 18, posture: 64, recovery: 48 },
  { t: 50000, tremor: 14, posture: 60, recovery: 44 },
  { t: 62000, tremor: 12, posture: 56, recovery: 34 },
  { t: 68000, tremor: 11, posture: 54, recovery: 28 },
]

export const LOG_EVENTS: { t: number; line: string }[] = [
  { t: 200, line: 'Session armed · landscape lock' },
  { t: 1400, line: 'Dropping in · overlay live' },
  { t: 5200, line: 'Looting · pitch drifting flat' },
  { t: 8600, line: 'Flexed-neck zone · raise the phone' },
  { t: 13500, line: 'CLUTCH SPIKE · death-grip / micro-tremor' },
  { t: 16800, line: 'CLUTCH SPIKE · firefight spray' },
  { t: 21200, line: 'CLUTCH SPIKE · recoil + thumb mash' },
  { t: 25400, line: 'CLUTCH SPIKE · close-range spray' },
  { t: 28600, line: 'Compound clear · overlay quiet' },
  { t: 34000, line: 'Mid-round settle · tremor easing' },
  { t: 38200, line: 'Queue · paced breathe cue' },
  { t: 50200, line: 'Between rounds · 15s finger-on-lens' },
  { t: 65200, line: 'Recovery HR locked · 94 → 81' },
]

function sampleFrames(t: number): Omit<NumericFrame, 't'> {
  if (t <= FRAMES[0].t) return FRAMES[0]
  const last = FRAMES[FRAMES.length - 1]
  if (t >= last.t) return last
  for (let i = 0; i < FRAMES.length - 1; i++) {
    const a = FRAMES[i]
    const b = FRAMES[i + 1]
    if (t >= a.t && t <= b.t) {
      const p = smoothstep((t - a.t) / (b.t - a.t))
      return {
        tremor: lerp(a.tremor, b.tremor, p),
        posture: lerp(a.posture, b.posture, p),
        recovery: lerp(a.recovery, b.recovery, p),
      }
    }
  }
  return last
}

export function phaseAt(t: number): DemoPhase {
  if (t < PHASE_WINDOWS.early[0]) return 'drop'
  if (t < PHASE_WINDOWS.firefight[0]) return 'early'
  if (t < PHASE_WINDOWS.quiet[0]) return 'firefight'
  if (t < PHASE_WINDOWS.queue[0]) return 'quiet'
  if (t < PHASE_WINDOWS.ppg[0]) return 'queue'
  if (t < PHASE_WINDOWS.recap[0]) return 'ppg'
  return 'recap'
}

export function phaseProgress(phase: DemoPhase, t: number): number {
  if (phase === 'recap') return 1
  const [start, end] = PHASE_WINDOWS[phase]
  return Math.min(1, Math.max(0, (t - start) / (end - start)))
}

export function demoScoresAt(t: number): Scores {
  const raw = sampleFrames(t)
  const spike = SPIKE_TIMES.some((s) => Math.abs(t - s) < 650)
  const tremor = Math.min(100, raw.tremor + (spike ? 8 : 0))
  const clutch = Math.round(tremor * 0.42 + raw.posture * 0.33 + raw.recovery * 0.25)
  return {
    tremor: Math.round(tremor),
    posture: Math.round(raw.posture),
    recovery: Math.round(raw.recovery),
    clutch: Math.min(100, clutch + (spike ? 4 : 0)),
  }
}

export function statusFor(phase: DemoPhase, spike: boolean): string {
  if (spike) return 'Firefight · grip load spike'
  switch (phase) {
    case 'drop':
      return 'Match start · overlay arming'
    case 'early':
      return 'Looting · posture drifting'
    case 'firefight':
      return 'Contact · death-grip window'
    case 'quiet':
      return 'Quiet mid-round · overlay idle'
    case 'queue':
      return 'Matchmaking · breathe with the pulse'
    case 'ppg':
      return 'Between rounds · finger on lens'
    case 'recap':
      return 'Session recap ready'
  }
}

export function chipsFor(phase: DemoPhase): string[] {
  const base = ['Landscape lock', 'Demo replay']
  switch (phase) {
    case 'drop':
      return [...base, 'Dropping']
    case 'early':
      return [...base, 'Pitch drifting']
    case 'firefight':
      return [...base, 'Tremor hot']
    case 'quiet':
      return [...base, 'Overlay quiet']
    case 'queue':
      return [...base, 'Haptic cue']
    case 'ppg':
      return [...base, 'PPG 15s']
    case 'recap':
      return ['Wellness only', 'Rahul recap']
  }
}

export function logAt(t: number): string[] {
  return LOG_EVENTS.filter((e) => e.t <= t)
    .slice(-4)
    .map((e) => e.line)
}

export function demoHrAt(t: number): number | null {
  if (t < PHASE_WINDOWS.ppg[0] + 2200) return null
  const p = Math.min(1, (t - PHASE_WINDOWS.ppg[0] - 2200) / 12000)
  return Math.round(lerp(96, 81, smoothstep(p)))
}

export function breathAt(t: number): { phase: 'in' | 'hold' | 'out'; label: string } {
  const cycle = 4000
  const local = ((t % cycle) + cycle) % cycle
  if (local < 1600) return { phase: 'in', label: 'Inhale  4' }
  if (local < 2200) return { phase: 'hold', label: 'Hold' }
  return { phase: 'out', label: 'Exhale  4' }
}
