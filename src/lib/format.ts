export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function smoothstep(t: number): number {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function loadTone(value: number): 'ok' | 'warn' | 'hot' {
  if (value >= 66) return 'hot'
  if (value >= 36) return 'warn'
  return 'ok'
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}
