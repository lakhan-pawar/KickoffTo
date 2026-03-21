import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import Link from 'next/link'
import type { Metadata } from 'next'
import wcHistory from '@/data/wc-history.json'

export const metadata: Metadata = {
  title: 'WC History — KickoffTo',
  description: 'Every World Cup from 1930 to 2026. Narrated by The Archive.',
}

// Winner kit colours for visual richness
const WINNER_COLORS: Record<number, string> = {
  1930: '#75aadb', 1934: '#009246', 1938: '#009246', 1950: '#75aadb',
  1954: '#000000', 1958: '#f7e03b', 1962: '#f7e03b', 1966: '#cf081f',
  1970: '#f7e03b', 1974: '#000000', 1978: '#75aadb', 1982: '#009246',
  1986: '#75aadb', 1990: '#000000', 1994: '#f7e03b', 1998: '#003087',
  2002: '#f7e03b', 2006: '#009246', 2010: '#d4213d', 2014: '#000000',
  2018: '#003087', 2022: '#75aadb', 2026: '#16a34a',
}

export default function HistoryPage() {
  const history = wcHistory as any[]

  // Group by decade
  const byDecade = history.reduce<Record<string, any[]>>((acc, wc) => {
    const decade = `${Math.floor(wc.year / 10) * 10}s`
    if (!acc[decade]) acc[decade] = []
    acc[decade].push(wc)
    return acc
  }, {})

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 14px 72px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 28, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 4,
          }}>
            MEMORY PALACE
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Every World Cup 1930–2026 · Narrated by The Archive
          </p>
        </div>

        {/* Archive character strip */}
        <div style={{
          background: '#1a3a1a', border: '1px solid rgba(26,90,26,0.4)',
          borderLeft: '3px solid #22c55e',
          borderRadius: '0 12px 12px 0',
          padding: '12px 16px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: '#0d1f0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 13, color: 'rgba(255,255,255,0.85)',
            flexShrink: 0,
          }}>
            AR
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>
              The Archive · Football Historian
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
              &ldquo;Every final a moment. Every heartbreak a story. Tap any year — I&apos;ll tell you what it really meant.&rdquo;
            </div>
          </div>
          <Link href="/characters/the-archive" style={{
            marginLeft: 'auto', flexShrink: 0,
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 11, color: '#4ade80',
            textDecoration: 'none', fontWeight: 600,
          }}>
            Chat →
          </Link>
        </div>

        {/* Decade sections */}
        {Object.entries(byDecade).map(([decade, tournaments]) => (
          <div key={decade} style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 10,
            }}>
              {decade}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 10,
            }}>
              {tournaments.map((wc: any) => {
                const kitColor = WINNER_COLORS[wc.year] ?? '#16a34a'
                const isRecent = wc.year >= 2018
                const is2026 = wc.year === 2026

                return (
                  <Link
                    key={wc.year}
                    href={`/history/${wc.year}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      borderRadius: 16, overflow: 'hidden',
                      background: kitColor,
                      position: 'relative',
                      paddingTop: '120%',
                      boxShadow: `0 4px 16px ${kitColor}44`,
                      transition: 'transform 0.18s, box-shadow 0.18s',
                      cursor: 'pointer',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 10,
                      }}>

                        {/* Ghost year watermark */}
                        <div style={{
                          position: 'absolute',
                          bottom: -8, right: -4,
                          fontFamily: 'var(--font-display)', fontWeight: 900,
                          fontSize: 56, lineHeight: 1,
                          color: 'rgba(0,0,0,0.15)',
                          fontVariantNumeric: 'tabular-nums',
                          pointerEvents: 'none', userSelect: 'none',
                          letterSpacing: -3,
                        }}>
                          {wc.year}
                        </div>

                        {/* Year badge */}
                        <div style={{
                          alignSelf: 'flex-start',
                          background: 'rgba(0,0,0,0.4)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: 8, padding: '3px 8px',
                          fontFamily: 'var(--font-display)',
                          fontSize: 13, fontWeight: 800,
                          color: '#fff', letterSpacing: -0.3,
                        }}>
                          {wc.year}
                        </div>

                        {/* Winner flag — the hero */}
                        <div style={{
                          position: 'absolute',
                          top: '50%', left: '50%',
                          transform: 'translate(-50%, -55%)',
                          fontSize: 44, lineHeight: 1,
                          filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))',
                          userSelect: 'none',
                        }}>
                          {wc.winnerFlag}
                        </div>

                        {/* Bottom info pill */}
                        <div style={{
                          background: 'rgba(0,0,0,0.55)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 10, padding: '7px 9px',
                          position: 'relative',
                        }}>
                          <div style={{
                            fontSize: 12, fontWeight: 800,
                            color: '#fff', lineHeight: 1.2,
                          }}>
                            {is2026 ? 'TBD' : wc.winner}
                          </div>
                          <div style={{
                            fontSize: 9, color: 'rgba(255,255,255,0.55)',
                            marginTop: 2,
                          }}>
                            {wc.host}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </>
  )
}
