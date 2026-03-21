'use client'
import Link from 'next/link'

interface TeamStanding {
  code: string
  name: string
  flag: string
  confederation: string
  kitColors: string[]
  P: number
  W: number
  D: number
  L: number
  GF: number
  GA: number
  GD: number
  Pts: number
}

interface GroupsListProps {
  groups: any[]
}

function buildStandings(teams: any[]): TeamStanding[] {
  return teams.map(team => ({
    ...team,
    P: 0, W: 0, D: 0, L: 0,
    GF: 0, GA: 0, GD: 0, Pts: 0,
  }))
}

export function GroupsList({ groups }: GroupsListProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 16,
    }}>
      {groups.map(group => {
        const standings = buildStandings(group.teams)
        return (
          <div key={group.letter} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border)',
              padding: '10px 16px',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 16, color: 'var(--text)',
              }}>
                Group {group.letter}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                P W D L GD Pts
              </span>
            </div>

            {standings.map((team, i) => (
              <Link
                key={team.code}
                href={`/teams/${team.code.toLowerCase()}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  padding: '10px 16px', gap: 10,
                  borderBottom: i < standings.length - 1
                    ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: i < 2 ? 'var(--green)' : 'var(--text-3)',
                    minWidth: 14, textAlign: 'center',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {i + 1}
                  </span>

                  <span style={{ fontSize: 20, flexShrink: 0 }}>
                    {team.flag}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 500, color: 'var(--text)',
                    flex: 1, minWidth: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {team.name}
                  </span>

                  <div style={{
                    display: 'flex', gap: 12,
                    fontSize: 12, color: 'var(--text-3)',
                    fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                  }}>
                    <span style={{ minWidth: 16, textAlign: 'center' }}>{team.P}</span>
                    <span style={{ minWidth: 16, textAlign: 'center' }}>{team.W}</span>
                    <span style={{ minWidth: 16, textAlign: 'center' }}>{team.D}</span>
                    <span style={{ minWidth: 16, textAlign: 'center' }}>{team.L}</span>
                    <span style={{ minWidth: 24, textAlign: 'center' }}>
                      {team.GD === 0 ? '0' : team.GD > 0 ? `+${team.GD}` : team.GD}
                    </span>
                    <span style={{
                      minWidth: 24, textAlign: 'center',
                      fontWeight: 700,
                      color: team.Pts > 0 ? 'var(--text)' : 'var(--text-3)',
                    }}>
                      {team.Pts}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            <div style={{
              padding: '6px 16px',
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: 16, fontSize: 9,
              color: 'var(--text-3)',
            }}>
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                ── Top 2 advance
              </span>
              <span>Matches start June 11</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
