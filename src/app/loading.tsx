export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B1F3A',
        color: '#E0B040',
        fontFamily: 'var(--font-press-start), monospace',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        gap: '1rem',
      }}
    >
      <p>ESTABLISHING MARINES RADAR LINK...</p>
      <p style={{ fontFamily: 'var(--font-vt323), monospace', fontSize: '1.4rem', color: '#F4EFE0' }}>
        Loading Fleet Roster
      </p>
    </div>
  )
}
