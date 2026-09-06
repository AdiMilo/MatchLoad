export function GameBackdrop({ quiet, spike }: { quiet?: boolean; spike?: boolean }) {
  return (
    <div
      className={`backdrop ${quiet ? 'backdrop-quiet' : ''} ${spike ? 'backdrop-spike' : ''}`}
      aria-hidden="true"
    >
      <div className="backdrop-terrain" />
      <div className="backdrop-zone" />
      <div className="backdrop-minimap" />
      <div className="backdrop-cross" />
      <div className="backdrop-scan" />
    </div>
  )
}
