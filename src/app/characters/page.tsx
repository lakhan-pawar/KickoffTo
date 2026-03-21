import { Navbar } from '@/components/ui/Navbar'
import { Ticker } from '@/components/ui/Ticker'
import { BottomNav } from '@/components/ui/BottomNav'
import { CHARACTERS } from '@/lib/constants'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Characters — KickoffTo',
  description: '16 AI characters. Each one a different lens on WC2026.',
}

const TICKER_SEGMENTS = [
  '🎭 16 characters · 16 perspectives on WC2026',
  'From El Maestro to ARIA-9 · each one unique',
  'Chat · Voice mode · Deep-link any character',
]

export default async function CharactersPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>
}) {
  const { tier } = await searchParams
  const activeTier = tier ?? 'All'
  const filtered = activeTier === 'All'
    ? CHARACTERS
    : CHARACTERS.filter(c => c.tier === activeTier)

  const TABS = ['All', 'Strategy', 'Data', 'Entertainment']

  return (
    <>
      <Navbar />
      <Ticker segments={TICKER_SEGMENTS} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 100px' }}>

        <div style={{ padding: '32px 0 24px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 40px)',
            letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
          }}>
            THE CHARACTERS
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>
            16 AI characters. Each one a different lens on WC2026.
          </p>
          <Link href="/characters/council" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500,
            color: 'var(--text)', textDecoration: 'none',
          }}>
            ⚡ Character Council — all 16 debate simultaneously →
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {TABS.map(tab => (
            <Link
              key={tab}
              href={tab === 'All' ? '/characters' : `/characters?tier=${tab}`}
              style={{
                padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                textDecoration: 'none',
                border: `1px solid ${activeTier === tab ? 'var(--green)' : 'var(--border)'}`,
                background: activeTier === tab ? 'var(--green-tint)' : 'transparent',
                color: activeTier === tab ? 'var(--green)' : 'var(--text-2)',
              }}
            >
              {tab} {tab === 'All' ? `(${CHARACTERS.length})` : ''}
            </Link>
          ))}
        </div>

        {/* Characters grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 10,
        }}>
          {filtered.map(character => (
            <Link
              key={character.id}
              href={character.phase === 1 ? `/characters/${character.id}` : '#'}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12, padding: 14,
                opacity: character.phase === 1 ? 1 : 0.5,
                position: 'relative',
                cursor: character.phase === 1 ? 'pointer' : 'default',
              }}>
                {character.phase > 1 && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 9, fontWeight: 600, padding: '1px 5px',
                    borderRadius: 99, background: 'var(--bg-elevated)',
                    color: 'var(--text-3)', border: '1px solid var(--border)',
                  }}>
                    Phase {character.phase}
                  </div>
                )}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: character.color,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 13, color: 'rgba(255,255,255,0.85)',
                  letterSpacing: -0.5, marginBottom: 8,
                }}>
                  {character.monogram}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                  {character.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 6 }}>
                  {character.role}
                </div>
                {character.phase === 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--green)', display: 'inline-block',
                      animation: 'livePulse 1.5s ease-in-out infinite',
                    }} />
                    <span style={{ fontSize: 9, color: 'var(--green)' }}>Online</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
