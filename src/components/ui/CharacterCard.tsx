'use client'
import Link from 'next/link'
import type { Character } from '@/types'

interface CharacterCardProps {
  character: Character
  showOnlineStatus?: boolean
}

export function CharacterCard({ character, showOnlineStatus = true }: CharacterCardProps) {
  return (
    <Link href={`/characters/${character.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 14, cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = character.color
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(0)'
      }}>
        {/* Avatar with monogram */}
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: character.color,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
          color: 'rgba(255,255,255,0.85)', marginBottom: 8,
          letterSpacing: -0.5,
        }}>
          {character.monogram}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 1 }}>
          {character.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 6 }}>
          {character.role}
        </div>

        {showOnlineStatus && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="animate-live" style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--green)', display: 'inline-block',
            }} />
            <span style={{ fontSize: 9, color: 'var(--green)' }}>Online</span>
          </div>
        )}
      </div>
    </Link>
  )
}
