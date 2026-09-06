export function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

export function pulseBreathe(): boolean {
  if (!canVibrate()) return false
  try {
    return navigator.vibrate([35, 40, 55])
  } catch {
    return false
  }
}

export function pulseSpike(): boolean {
  if (!canVibrate()) return false
  try {
    return navigator.vibrate(18)
  } catch {
    return false
  }
}
