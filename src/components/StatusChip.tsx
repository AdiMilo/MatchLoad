export function StatusChip({
  children,
  tone = 'idle',
}: {
  children: string
  tone?: 'idle' | 'ok' | 'warn' | 'hot'
}) {
  return <span className={`chip chip-${tone}`}>{children}</span>
}
