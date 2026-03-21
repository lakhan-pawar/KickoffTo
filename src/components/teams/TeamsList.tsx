'use client'
import Link from 'next/link'

const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA:     '#003087',
  CONMEBOL: '#009c3b',
  CONCACAF: '#e31837',
  CAF:      '#ffd700',
  AFC:      '#cc0001',
  OFC:      '#00a0e9',
}

interface TeamsListProps {
  byConfederation: Record<string, any[]>
  confederationOrder: string[]
}

export function TeamsList({ byConfederation, confederationOrder }: TeamsListProps) {
  return (
    <>
      {confederationOrder.map(confed => {
        const teams = byConfederation[confed]
        if (!teams?.length) return null
        const confColor = CONFEDERATION_COLORS[confed] ?? '#888'

        return (
          <div key={confed} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              <div style={{
                height: 3, width: 20, borderRadius: 2,
                background: confColor,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700, color: 'var(--text-2)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {confed} · {teams.length} teams
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 8,
            }}>
              {teams.map(team => (
                <Link
                  key={team.code}
                  href={`/teams/${team.code.toLowerCase()}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10, padding: 12,
                    position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.15s, transform 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = confColor
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'var(--border)'
                    el.style.transform = 'translateY(0)'
                  }}>
                    <div style={{
                      position: 'absolute', right: -8, top: -8,
                      fontSize: 48, opacity: 0.06, lineHeight: 1,
                      pointerEvents: 'none',
                    }}>
                      {team.flag}
                    </div>

                    <div style={{
                      display: 'flex', gap: 2, marginBottom: 10,
                    }}>
                      {team.kitColors.map((color: string, i: number) => (
                        <div key={i} style={{
                          height: 3, flex: 1, borderRadius: 2,
                          background: color,
                        }} />
                      ))}
                    </div>

                    <div style={{ fontSize: 24, marginBottom: 6 }}>
                      {team.flag}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 12,
                      fontWeight: 700, color: 'var(--text)', marginBottom: 3,
                      lineHeight: 1.2,
                    }}>
                      {team.name}
                    </div>
                    <div style={{
                      display: 'flex', gap: 4, alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: 9, fontWeight: 600, color: confColor,
                        background: confColor + '22',
                        padding: '1px 5px', borderRadius: 3,
                      }}>
                        {confed}
                      </span>
                      <span style={{ fontSize: 9, color: 'var(--text-3)' }}>
                        Group {team.group}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}
