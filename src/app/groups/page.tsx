import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import { GroupsList } from '@/components/teams/GroupsList'
import type { Metadata } from 'next'
import groupsData from '@/data/wc2026-groups.json'

export const metadata: Metadata = {
  title: 'WC2026 Groups — KickoffTo',
  description: 'All 12 WC2026 groups. 48 teams. Group stage standings.',
}

export const revalidate = 300

export default function GroupsPage() {
  const { groups } = groupsData

  return (
    <>
      <Navbar />
      <Ticker segments={[
        '⚽ WC2026 Group Stage · 12 groups · 48 teams',
        'Top 2 from each group advance to Round of 32',
        'Group stage: June 11 – July 2, 2026',
      ]} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 100px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(24px, 4vw, 40px)',
          letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
        }}>
          GROUPS
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 8 }}>
          12 groups · 48 teams · Top 2 advance
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 28 }}>
          Standings update live from June 11 · Groups A–L
        </p>

        <GroupsList groups={groups} />

        <div style={{
          marginTop: 24, padding: 16,
          background: 'var(--bg-elevated)', borderRadius: 10,
          fontSize: 12, color: 'var(--text-3)', textAlign: 'center',
        }}>
          Standings update live once the tournament begins June 11 ·
          <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/groups"
            target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--green)', marginLeft: 4 }}>
            Official draw results on FIFA.com →
          </a>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
