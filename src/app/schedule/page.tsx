'use client'
import { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import Link from 'next/link'
import { FlagDisplay } from '@/components/ui/FlagDisplay'

const SCHEDULE = [
  // Group stage opening weekend
  {
    id: 'can-vcr', date: '2026-06-11', time: '20:00',
    homeTeam: { name: 'Canada', flag: '🇨🇦', code: 'CAN' },
    awayTeam: { name: 'Venezuela', flag: '🇻🇪', code: 'VEN' },
    venue: 'BMO Field, Toronto', round: 'Group L', group: 'L', status: 'scheduled',
  },
  {
    id: 'mex-nzl', date: '2026-06-12', time: '15:00',
    homeTeam: { name: 'Mexico', flag: '🇲🇽', code: 'MEX' },
    awayTeam: { name: 'New Zealand', flag: '🇳🇿', code: 'NZL' },
    venue: 'Estadio Azteca, Mexico City', round: 'Group C', group: 'C', status: 'scheduled',
  },
  {
    id: 'usa-pan', date: '2026-06-12', time: '18:00',
    homeTeam: { name: 'United States', flag: '🇺🇸', code: 'USA' },
    awayTeam: { name: 'Panama', flag: '🇵🇦', code: 'PAN' },
    venue: 'SoFi Stadium, Los Angeles', round: 'Group A', group: 'A', status: 'scheduled',
  },
  {
    id: 'arg-vcr', date: '2026-06-13', time: '15:00',
    homeTeam: { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
    awayTeam: { name: 'Chile', flag: '🇨🇱', code: 'CHI' },
    venue: 'MetLife Stadium, New York', round: 'Group B', group: 'B', status: 'scheduled',
  },
  {
    id: 'esp-bra', date: '2026-06-13', time: '21:00',
    homeTeam: { name: 'Spain', flag: '🇪🇸', code: 'ESP' },
    awayTeam: { name: 'Brazil', flag: '🇧🇷', code: 'BRA' },
    venue: 'AT&T Stadium, Dallas', round: 'Group G', group: 'G', status: 'scheduled',
  },
  {
    id: 'eng-can', date: '2026-06-14', time: '18:00',
    homeTeam: { name: 'England', flag: '🏴', code: 'ENG' },
    awayTeam: { name: 'Canada', flag: '🇨🇦', code: 'CAN' },
    venue: 'Estadio Azteca, Mexico City', round: 'Group H', group: 'H', status: 'scheduled',
  },
  {
    id: 'ger-jpn', date: '2026-06-14', time: '21:00',
    homeTeam: { name: 'Germany', flag: '🇩🇪', code: 'GER' },
    awayTeam: { name: 'Japan', flag: '🇯🇵', code: 'JPN' },
    venue: 'Levi\'s Stadium, San Francisco', round: 'Group F', group: 'F', status: 'scheduled',
  },
  {
    id: 'fra-bel', date: '2026-06-15', time: '18:00',
    homeTeam: { name: 'France', flag: '🇫🇷', code: 'FRA' },
    awayTeam: { name: 'Belgium', flag: '🇧🇪', code: 'BEL' },
    venue: 'Rose Bowl, Los Angeles', round: 'Group E', group: 'E', status: 'scheduled',
  },
  {
    id: 'por-kor', date: '2026-06-15', time: '21:00',
    homeTeam: { name: 'Portugal', flag: '🇵🇹', code: 'POR' },
    awayTeam: { name: 'South Korea', flag: '🇰🇷', code: 'KOR' },
    venue: 'Gillette Stadium, Boston', round: 'Group D', group: 'D', status: 'scheduled',
  },
  {
    id: 'ned-sen', date: '2026-06-16', time: '15:00',
    homeTeam: { name: 'Netherlands', flag: '🇳🇱', code: 'NED' },
    awayTeam: { name: 'Senegal', flag: '🇸🇳', code: 'SEN' },
    venue: 'Camping World Stadium, Orlando', round: 'Group I', group: 'I', status: 'scheduled',
  },
  {
    id: 'uru-rsa', date: '2026-06-16', time: '21:00',
    homeTeam: { name: 'Uruguay', flag: '🇺🇾', code: 'URU' },
    awayTeam: { name: 'South Africa', flag: '🇿🇦', code: 'RSA' },
    venue: 'Arrowhead Stadium, Kansas City', round: 'Group J', group: 'J', status: 'scheduled',
  },
  {
    id: 'col-den', date: '2026-06-17', time: '18:00',
    homeTeam: { name: 'Colombia', flag: '🇨🇴', code: 'COL' },
    awayTeam: { name: 'Denmark', flag: '🇩🇰', code: 'DEN' },
    venue: 'Empower Field, Denver', round: 'Group K', group: 'K', status: 'scheduled',
  },
  {
    id: 'ita-sau', date: '2026-06-17', time: '21:00',
    homeTeam: { name: 'Italy', flag: '🇮🇹', code: 'ITA' },
    awayTeam: { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SAU' },
    venue: 'Estadio Jalisco, Guadalajara', round: 'Group L', group: 'L', status: 'scheduled',
  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function groupByDate(fixtures: typeof SCHEDULE) {
  const map: Record<string, typeof SCHEDULE> = {}
  fixtures.forEach(f => {
    if (!map[f.date]) map[f.date] = []
    map[f.date].push(f)
  })
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
}

export default function SchedulePage() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? SCHEDULE
    : SCHEDULE.filter(f => f.round === filter)

  const grouped = groupByDate(filtered)
  const daysUntil = Math.max(0, Math.floor(
    (new Date('2026-06-11T20:00:00Z').getTime() - Date.now()) / 86400000
  ))

  return (
    <>
      <Navbar />
      <Ticker segments={[
        '📅 WC2026 Schedule · June 11 – July 19, 2026',
        '104 matches · 16 venues · 3 host nations',
        `Tournament begins in ${daysUntil} days`,
      ]} />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 100px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(24px, 4vw, 40px)',
          letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
        }}>
          SCHEDULE
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>
          Opening group stage fixtures · All times local to venue
        </p>

        {/* Group filter */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24,
        }}>
          {['All', 'Group A', 'Group B', 'Group C', 'Group D',
            'Group E', 'Group F', 'Group G', 'Group H'].map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              style={{
                padding: '5px 12px', borderRadius: 99, fontSize: 11,
                fontWeight: 500, cursor: 'pointer',
                background: filter === r ? 'var(--green-tint)' : 'transparent',
                border: `1px solid ${filter === r ? 'var(--green)' : 'var(--border)'}`,
                color: filter === r ? 'var(--green)' : 'var(--text-2)',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {grouped.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0',
            color: 'var(--text-3)', fontSize: 13 }}>
            No fixtures found for this filter.
          </div>
        ) : (
          grouped.map(([date, fixtures]) => (
            <div key={date} style={{ marginBottom: 24 }}>
              {/* Date header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 10,
              }}>
                <div style={{
                  height: 1, flex: 1, background: 'var(--border)',
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>
                  {formatDate(date)}
                </span>
                <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
              </div>

              {/* Fixtures */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {fixtures.map(fixture => {
                  const isCanada = fixture.homeTeam.code === 'CAN' ||
                    fixture.awayTeam.code === 'CAN'

                  return (
                    <div
                      key={fixture.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: `1px solid ${isCanada
                          ? 'rgba(227,24,55,0.25)' : 'var(--border)'}`,
                        borderRadius: 10, padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Time */}
                      <div style={{
                        fontSize: 12, color: 'var(--text-3)',
                        fontVariantNumeric: 'tabular-nums',
                        minWidth: 50, flexShrink: 0,
                      }}>
                        {fixture.time} UTC
                      </div>

                      {/* Match */}
                      <div style={{
                        flex: 1, display: 'flex', alignItems: 'center',
                        gap: 10, minWidth: 200,
                      }}>
                        <FlagDisplay countryCode={fixture.homeTeam.code} emoji={fixture.homeTeam.flag} size={20} />
                        <span style={{
                          fontSize: 13, fontWeight: 600, color: 'var(--text)',
                        }}>
                          {fixture.homeTeam.name}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>vs</span>
                        <span style={{
                          fontSize: 13, fontWeight: 600, color: 'var(--text)',
                        }}>
                          {fixture.awayTeam.name}
                        </span>
                        <FlagDisplay countryCode={fixture.awayTeam.code} emoji={fixture.awayTeam.flag} size={20} />
                        {isCanada && (
                          <span style={{ fontSize: 12 }}>🍁</span>
                        )}
                      </div>

                      {/* Venue + round */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>
                          {fixture.round}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                          {fixture.venue.split(',')[0]}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <Link href={`/preview/${fixture.id}`} style={{
                          fontSize: 10, color: 'var(--text-3)', textDecoration: 'none',
                          padding: '4px 8px', borderRadius: 6,
                          border: '1px solid var(--border)',
                          background: 'var(--bg-elevated)',
                        }}>
                          Preview
                        </Link>
                        <Link href={`/live/${fixture.id}`} style={{
                          fontSize: 10, color: 'var(--green)', textDecoration: 'none',
                          padding: '4px 8px', borderRadius: 6,
                          border: '1px solid var(--green)',
                          background: 'var(--green-tint)',
                          fontWeight: 600,
                        }}>
                          Live room
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        <div style={{
          marginTop: 20, padding: 14,
          background: 'var(--bg-elevated)', borderRadius: 10,
          fontSize: 12, color: 'var(--text-3)', textAlign: 'center',
        }}>
          Showing opening group stage fixtures ·
          <a
            href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/match-schedule"
            target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--green)', marginLeft: 4 }}
          >
            Full 104-match schedule on FIFA.com →
          </a>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
