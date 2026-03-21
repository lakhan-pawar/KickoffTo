import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import Link from 'next/link'
import type { Metadata } from 'next'
import { FlagDisplay } from '@/components/ui/FlagDisplay'
import groupsData from '@/data/wc2026-groups.json'

export const metadata: Metadata = {
  title: 'WC2026 Groups — KickoffTo',
  description: 'All 12 WC2026 groups.',
}

export const revalidate = 300

export default function GroupsPage() {
  const { groups } = groupsData

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 14px 72px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 28, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 4,
        }}>
          GROUPS
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>
          12 groups · 48 teams · Top 2 advance to Round of 32
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 12,
        }}>
          {groups.map(group => (
            <div key={group.letter} style={{
              borderRadius: 16, overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}>

              {/* Kit colour rainbow stripe */}
              <div style={{ height: 5, display: 'flex' }}>
                {group.teams.map(t => (
                  <div key={t.code} style={{ flex: 1, background: t.kitColors[0] }} />
                ))}
              </div>

              {/* Group header */}
              <div style={{
                padding: '12px 14px 10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 20, color: 'var(--text)', letterSpacing: -0.5,
                }}>
                  Group {group.letter}
                </div>
                {/* Mini flags row */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {group.teams.map(t => (
                    <FlagDisplay key={t.code} countryCode={t.code} emoji={t.flag} size={18} />
                  ))}
                </div>
              </div>

              {/* Standings table */}
              <div>
                {/* Header */}
                <div style={{
                  display: 'flex', padding: '6px 14px',
                  background: 'var(--bg-elevated)',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ flex: 1, fontSize: 9, fontWeight: 700,
                    color: 'var(--text-3)', textTransform: 'uppercase',
                    letterSpacing: '0.06em' }}>
                    Team
                  </span>
                  {['P','W','D','L','Pts'].map(h => (
                    <span key={h} style={{
                      width: 28, textAlign: 'center',
                      fontSize: 9, fontWeight: 700,
                      color: 'var(--text-3)', textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Team rows */}
                {group.teams.map((team, i) => (
                  <Link key={team.code} href={`/teams/${team.code.toLowerCase()}`}
                    style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      padding: '9px 14px',
                      borderBottom: i < group.teams.length - 1
                        ? '1px solid var(--border)' : 'none',
                      gap: 8, cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    >
                      {/* Position */}
                      <span style={{
                        fontSize: 11, fontWeight: 700, width: 16,
                        color: i < 2 ? 'var(--green)' : 'var(--text-3)',
                        flexShrink: 0, textAlign: 'center',
                      }}>
                        {i + 1}
                      </span>

                      {/* Kit swatch */}
                      <div style={{
                        width: 4, height: 28, borderRadius: 2,
                        background: team.kitColors[0], flexShrink: 0,
                      }} />

                      {/* Flag */}
                      <FlagDisplay countryCode={team.code} emoji={team.flag} size={22} style={{ flexShrink: 0 }} />

                      {/* Full name — no truncation */}
                      <span style={{
                        flex: 1, fontSize: 13, fontWeight: 500,
                        color: 'var(--text)', minWidth: 0,
                      }}>
                        {team.name}
                      </span>

                      {/* Stats */}
                      {[0, 0, 0, 0].map((v, j) => (
                        <span key={j} style={{
                          width: 28, textAlign: 'center',
                          fontSize: 12, color: 'var(--text-3)',
                          fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                        }}>
                          0
                        </span>
                      ))}
                      {/* Points */}
                      <span style={{
                        width: 28, textAlign: 'center',
                        fontSize: 13, fontWeight: 700,
                        color: 'var(--text)',
                        fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                      }}>
                        0
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                padding: '7px 14px',
                background: 'var(--bg-elevated)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{
                  fontSize: 10, color: 'var(--green)', fontWeight: 700,
                }}>
                  ↑ Top 2 advance
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  From June 11
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
