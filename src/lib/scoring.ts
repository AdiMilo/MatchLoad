import { clamp } from './format.ts'
import type { RecapData, Scores } from '../types.ts'

export function clutchFromSubscores(
  tremor: number,
  posture: number,
  recovery: number,
): number {
  return clamp(Math.round(tremor * 0.42 + posture * 0.33 + recovery * 0.25))
}

export function scoresOf(tremor: number, posture: number, recovery: number): Scores {
  return {
    tremor: clamp(tremor),
    posture: clamp(posture),
    recovery: clamp(recovery),
    clutch: clutchFromSubscores(tremor, posture, recovery),
  }
}

export function recoveryFromHr(hr: number | null): number {
  if (hr == null) return 28
  return clamp(Math.round(((hr - 62) / 48) * 100))
}

export function liveRecap(input: {
  spikes: number
  flexedSeconds: number
  landscapeSeconds: number
  hrPre: number | null
  hrPost: number | null
  meanPitch: number | null
}): RecapData {
  const postureMinutes = Math.max(0.2, input.flexedSeconds / 60)
  const landscapeMinutes = Math.max(0.2, input.landscapeSeconds / 60)
  const delta =
    input.hrPre != null && input.hrPost != null
      ? input.hrPost - input.hrPre
      : null

  const flat = input.meanPitch != null && input.meanPitch < 38
  const tip = flat
    ? 'Tilt the phone up 15–20°.'
    : input.spikes >= 3
      ? 'Unclench between sprays — loosen both thumbs in queue.'
      : 'Keep the 4-count breathe in the next matchmaking wait.'

  const tipWhy = flat
    ? 'Your pitch sat in a flexed-neck zone for a large share of this session. Raising the device unloads the cervical flexors without leaving the match.'
    : input.spikes >= 3
      ? 'Death-grip bursts stacked during fight windows. A two-second thumb release in queue drops tremor load before the next contact.'
      : 'Between-round breathing is the recovery you can actually finish before the next drop.'

  return {
    player: 'You',
    matchLabel: 'Live-ish session',
    spikes: input.spikes,
    postureMinutes: Math.round(postureMinutes * 10) / 10,
    landscapeMinutes: Math.round(landscapeMinutes * 10) / 10,
    hrPre: input.hrPre,
    hrPost: input.hrPost,
    recoveryDelta: delta,
    tip,
    tipWhy,
    sessionNote:
      'Built from on-device pitch + motion magnitude plus a simulated 15s finger-on-lens capture. Coaching cues only.',
  }
}
