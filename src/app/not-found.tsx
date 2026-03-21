import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', textAlign: 'center', padding: 24,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 900,
        color: 'transparent', WebkitTextStroke: '1px var(--border)',
        lineHeight: 1, marginBottom: 16,
      }}>
        404
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24,
        fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>
        This page doesn&apos;t exist — yet.
      </p>
      <Link href="/" style={{
        background: 'var(--green)', color: '#fff', textDecoration: 'none',
        padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
      }}>
        Back to home →
      </Link>
    </div>
  )
}
