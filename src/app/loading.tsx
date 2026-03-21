export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 18,
        fontWeight: 800, color: 'var(--green)',
      }}>
        KickoffTo
      </div>
    </div>
  )
}
