import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import Link from 'next/link'
import type { Metadata } from 'next'
import { FlagDisplay } from '@/components/ui/FlagDisplay'
import groupsData from '@/data/wc2026-groups.json'

export const metadata: Metadata = {
  title: 'WC2026 Teams — KickoffTo',
  description: 'All 48 WC2026 teams. Click any team for squad and scout report.',
}

const CONF_COLORS: Record<string, string> = {
  UEFA:     '#1d4ed8',
  CONMEBOL: '#16a34a',
  CONCACAF: '#dc2626',
  CAF:      '#d97706',
  AFC:      '#7c3aed',
  OFC:      '#0891b2',
}

export default function TeamsPage() {
  const allTeams = groupsData.groups.flatMap(g =>
    g.teams.map(t => ({ ...t, group: g.letter }))
  )

  const byConf = allTeams.reduce<Record<string, typeof allTeams>>((acc, t) => {
    if (!acc[t.confederation]) acc[t.confederation] = []
    acc[t.confederation].push(t)
    return acc
  }, {})

  const confOrder = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 14px 72px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 28, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 4,
        }}>
          48 TEAMS
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 24 }}>
          Tap any team for squad · players · AI scout report
        </p>

        {confOrder.map(conf => {
          const teams = byConf[conf]
          if (!teams?.length) return null
          const confColor = CONF_COLORS[conf] ?? '#888'

          return (
            <div key={conf} style={{ marginBottom: 28 }}>
              {/* Confederation label */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
              }}>
                <div style={{
                  width: 4, height: 18, borderRadius: 2,
                  background: confColor,
                }} />
                <span style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--text-2)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {conf}
                </span>
                <span style={{
                  fontSize: 11, color: 'var(--text-3)',
                  background: 'var(--bg-elevated)', borderRadius: 6,
                  padding: '1px 7px', border: '1px solid var(--border)',
                }}>
                  {teams.length} teams
                </span>
              </div>

              {/* Team cards grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: 10,
              }}>
                {teams.map(team => (
                  <Link
                    key={team.code}
                    href={`/teams/${team.code.toLowerCase()}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      background: team.kitColors[0],
                      position: 'relative',
                      paddingTop: '130%', // portrait aspect ratio
                      boxShadow: `0 4px 16px ${team.kitColors[0]}55`,
                      transition: 'transform 0.18s, box-shadow 0.18s',
                      cursor: 'pointer',
                    }}>

                      {/* Inner content — absolutely positioned */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', padding: 10,
                      }}>

                        {/* Group badge top-right */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <div style={{
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: 7, padding: '2px 7px',
                            fontSize: 9, fontWeight: 800,
                            color: '#fff', letterSpacing: 0.3,
                          }}>
                            Grp {team.group}
                          </div>
                        </div>

                        {/* Giant flag centred */}
                        <div style={{
                          position: 'absolute',
                          top: '50%', left: '50%',
                          transform: 'translate(-50%,-56%)',
                          fontSize: 52, lineHeight: 1,
                          filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.45))',
                          userSelect: 'none',
                        }}>
                          <FlagDisplay countryCode={team.code} emoji={team.flag} size={52} />
                        </div>

                        {/* Name frosted pill at bottom */}
                        <div style={{
                          background: 'rgba(0,0,0,0.55)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          borderRadius: 10, padding: '7px 9px',
                        }}>
                          <div style={{
                            fontSize: 12, fontWeight: 800,
                            color: '#fff', lineHeight: 1.2,
                            letterSpacing: -0.2,
                          }}>
                            {team.name}
                          </div>
                          <div style={{
                            fontSize: 9, color: 'rgba(255,255,255,0.55)',
                            marginTop: 2, fontWeight: 500,
                          }}>
                            {conf}
                          </div>
                        </div>

                        {/* Kit second colour strip at bottom */}
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: 4,
                          background: team.kitColors[1] ?? 'rgba(255,255,255,0.25)',
                        }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </main>
      <BottomNav />
    </>
  )
}
