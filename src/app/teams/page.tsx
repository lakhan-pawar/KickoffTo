import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import { TeamsList } from '@/components/teams/TeamsList'
import type { Metadata } from 'next'
import groupsData from '@/data/wc2026-groups.json'

export const metadata: Metadata = {
  title: 'WC2026 Teams — KickoffTo',
  description: 'All 48 WC2026 teams. Squad info, star players and scouting reports.',
}

export default function TeamsPage() {
  // Flatten all teams from groups
  const allTeams = groupsData.groups.flatMap(g =>
    g.teams.map(t => ({ ...t, group: g.letter }))
  )

  const byConfederation = allTeams.reduce<Record<string, typeof allTeams>>((acc, team) => {
    if (!acc[team.confederation]) acc[team.confederation] = []
    acc[team.confederation].push(team)
    return acc
  }, {})

  const confederationOrder = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']

  return (
    <>
      <Navbar />
      <Ticker segments={[
        '🏳️ 48 teams · WC2026 · Canada · Mexico · USA',
        'Click any team for squad info and scout report',
      ]} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 100px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(24px, 4vw, 40px)',
          letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
        }}>
          48 TEAMS
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28 }}>
          Click any team for squad info, star players and AI scouting report.
        </p>

        <TeamsList
          byConfederation={byConfederation}
          confederationOrder={confederationOrder}
        />
      </main>
      <BottomNav />
    </>
  )
}
