'use client'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import Link from 'next/link'
import { Flag } from '@/components/ui/Flag'

const WC_DATA = [
  { year: 1930, winner: 'Uruguay',      code: 'URU', host: 'Uruguay',           kitColor: '#75aadb' },
  { year: 1934, winner: 'Italy',        code: 'ITA', host: 'Italy',             kitColor: '#003087' },
  { year: 1938, winner: 'Italy',        code: 'ITA', host: 'France',            kitColor: '#003087' },
  { year: 1950, winner: 'Uruguay',      code: 'URU', host: 'Brazil',            kitColor: '#75aadb' },
  { year: 1954, winner: 'W. Germany',   code: 'GER', host: 'Switzerland',       kitColor: '#1a1a1a' },
  { year: 1958, winner: 'Brazil',       code: 'BRA', host: 'Sweden',            kitColor: '#f7e03b' },
  { year: 1962, winner: 'Brazil',       code: 'BRA', host: 'Chile',             kitColor: '#f7e03b' },
  { year: 1966, winner: 'England',      code: 'ENG', host: 'England',           kitColor: '#cf081f' },
  { year: 1970, winner: 'Brazil',       code: 'BRA', host: 'Mexico',            kitColor: '#f7e03b' },
  { year: 1974, winner: 'W. Germany',   code: 'GER', host: 'W. Germany',        kitColor: '#1a1a1a' },
  { year: 1978, winner: 'Argentina',    code: 'ARG', host: 'Argentina',         kitColor: '#75aadb' },
  { year: 1982, winner: 'Italy',        code: 'ITA', host: 'Spain',             kitColor: '#003087' },
  { year: 1986, winner: 'Argentina',    code: 'ARG', host: 'Mexico',            kitColor: '#75aadb' },
  { year: 1990, winner: 'W. Germany',   code: 'GER', host: 'Italy',             kitColor: '#1a1a1a' },
  { year: 1994, winner: 'Brazil',       code: 'BRA', host: 'USA',               kitColor: '#f7e03b' },
  { year: 1998, winner: 'France',       code: 'FRA', host: 'France',            kitColor: '#003087' },
  { year: 2002, winner: 'Brazil',       code: 'BRA', host: 'Korea/Japan',       kitColor: '#f7e03b' },
  { year: 2006, winner: 'Italy',        code: 'ITA', host: 'Germany',           kitColor: '#003087' },
  { year: 2010, winner: 'Spain',        code: 'ESP', host: 'South Africa',      kitColor: '#d4213d' },
  { year: 2014, winner: 'Germany',      code: 'GER', host: 'Brazil',            kitColor: '#1a1a1a' },
  { year: 2018, winner: 'France',       code: 'FRA', host: 'Russia',            kitColor: '#003087' },
  { year: 2022, winner: 'Argentina',    code: 'ARG', host: 'Qatar',             kitColor: '#75aadb' },
  { year: 2026, winner: 'TBD',          code: 'USA', host: 'CAN/MEX/USA',       kitColor: '#16a34a' },
]

export function HistoryClient() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 14px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 32, letterSpacing: -1, color: 'var(--text)', marginBottom: 8,
          }}>
            HISTORY OF GLORY
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 600, margin: '0 auto' }}>
            Every World Cup from 1930 to the upcoming 2026 tournament.
            Explore the winners, the hosts, and the stories that shaped football.
          </p>
        </div>

        {/* Archive character strip */}
        <div style={{
          background: '#1a3a1a', border: '1px solid rgba(26,90,26,0.4)',
          borderLeft: '4px solid #22c55e',
          borderRadius: '0 16px 16px 0',
          padding: '16px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#0d1f0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 16, color: '#4ade80',
            flexShrink: 0,
          }}>
            📜
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#4ade80' }}>
              The Archive · Football Historian
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4, lineHeight: 1.5 }}>
              &ldquo;History isn&apos;t just scores; it&apos;s legends and heartbreaks. Tap any trophy year to dive into the record books.&rdquo;
            </div>
          </div>
          <Link href="/characters/the-archive" style={{
            flexShrink: 0,
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 10, padding: '8px 16px',
            fontSize: 12, color: '#4ade80',
            textDecoration: 'none', fontWeight: 700,
          }}>
            Chat →
          </Link>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}>
          {WC_DATA.map(wc => (
            <Link key={wc.year} href={`/history/${wc.year}`} style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                background: wc.kitColor,
                position: 'relative',
                paddingTop: '130%',
                boxShadow: `0 4px 16px ${wc.kitColor}55`,
                transition: 'transform 0.18s, box-shadow 0.18s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-4px) scale(1.03)'
                el.style.boxShadow = `0 10px 28px ${wc.kitColor}77`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'none'
                el.style.boxShadow = `0 4px 16px ${wc.kitColor}55`
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', padding: 10,
                }}>
                  {/* Year badge */}
                  <div style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 7, padding: '3px 8px',
                    fontFamily: 'var(--font-display)',
                    fontSize: 13, fontWeight: 800, color: '#fff',
                    position: 'relative', zIndex: 2,
                  }}>
                    {wc.year}
                  </div>

                  {/* Flag image — centred */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -52%)',
                    zIndex: 1,
                  }}>
                    <Flag
                      code={wc.code}
                      size={52}
                      style={{
                        borderRadius: 6,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                      }}
                    />
                  </div>

                  {/* Bottom info */}
                  <div style={{
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 10, padding: '7px 9px',
                    position: 'relative', zIndex: 2,
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: 800,
                      color: '#fff', lineHeight: 1.2,
                    }}>
                      {wc.winner}
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
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
