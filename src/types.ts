export type SessionMode = 'demo' | 'live'

export type AppScreen = 'home' | 'session' | 'between' | 'recap'

export type DemoPhase =
  | 'drop'
  | 'early'
  | 'firefight'
  | 'quiet'
  | 'queue'
  | 'ppg'
  | 'recap'

export type BetweenStage = 'breathe' | 'ppg'

export interface Scores {
  clutch: number
  tremor: number
  posture: number
  recovery: number
}

export interface RecapData {
  player: string
  matchLabel: string
  spikes: number
  postureMinutes: number
  landscapeMinutes: number
  hrPre: number | null
  hrPost: number | null
  recoveryDelta: number | null
  tip: string
  tipWhy: string
  sessionNote: string
}

export interface SessionView {
  screen: AppScreen
  phase: DemoPhase
  betweenStage: BetweenStage
  scores: Scores
  status: string
  chips: string[]
  spikeActive: boolean
  overlayQuiet: boolean
  elapsedMs: number
  phaseProgress: number
  breathPhase: 'in' | 'hold' | 'out'
  breathLabel: string
  ppgProgress: number
  hrLive: number | null
  log: string[]
  pitchDeg: number | null
  motionReady: boolean
  sensorNote: string | null
}
