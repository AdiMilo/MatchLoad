export function EventLog({ lines }: { lines: string[] }) {
  if (lines.length === 0) {
    return <div className="event-log event-log-empty">Waiting for session events…</div>
  }
  return (
    <ol className="event-log">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ol>
  )
}
