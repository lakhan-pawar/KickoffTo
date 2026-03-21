'use client'
import Link from 'next/link'
import type { Match } from '@/types'

interface MiniPlayerProps {
  match: Match | null
}

export function MiniPlayer({ match }: MiniPlayerProps) {
  if (!match || match.status !== 'live') return null

  return (
    <div style={{
      background: 'var(--green-tint)',
      borderTop: '1px solid var(--green)',
      padding: '0 16px',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      bottom: 60, // above bottom nav on mobile
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="animate-live" style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--green)', display: 'inline-block', flexShrink: 0,
        }} />
        <span style={{ fontSize: 14, letterSpacing: 2 }}>
          {match.homeTeam.flag} {match.awayTeam.flag}
        </span>
        <span style={{
          fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
          color: 'var(--text)',
        }}>
          {match.homeScore ?? 0}–{match.awayScore ?? 0}
        </span>
      </div>

      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>
        {match.minute}&apos;
      </span>

      <Link href={`/live/${match.id}`} style={{
        fontSize: 11, fontWeight: 700, color: 'var(--green)',
        textDecoration: 'none',
      }}>
        Watch →
      </Link>
    </div>
  )
}
