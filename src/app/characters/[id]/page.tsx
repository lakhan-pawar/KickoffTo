'use client'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { ChatPanel } from '@/components/characters/ChatPanel'
import { CHARACTER_MAP } from '@/lib/constants'
import Link from 'next/link'

export default function CharacterPage() {
  const params = useParams()
  const id = params?.id as string
  const character = CHARACTER_MAP.get(id)

  if (!character) {
    return (
      <>
        <Navbar />
        <main style={{ padding: '60px 16px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900,
            color: 'transparent', WebkitTextStroke: '1px var(--border)',
          }}>
            404
          </div>
          <p style={{ color: 'var(--text-2)', marginTop: 12, marginBottom: 20 }}>
            Character not found
          </p>
          <Link href="/characters" style={{ color: 'var(--green)', fontSize: 13 }}>
            ← All characters
          </Link>
        </main>
        <BottomNav />
      </>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', overflow: 'hidden',
    }}>

      {/* ── Identity header — colour floods ─────────── */}
      <div style={{
        background: character.color,
        padding: '0 14px 0',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ghost monogram watermark */}
        <div style={{
          position: 'absolute', right: -16, top: -8,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 96, color: 'rgba(255,255,255,0.08)',
          letterSpacing: -4, lineHeight: 1,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {character.monogram}
        </div>

        {/* Navbar-height spacer */}
        <div style={{ height: 52 }} />

        {/* Back + name row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          paddingBottom: 14,
        }}>
          <Link href="/characters" style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16, textDecoration: 'none', flexShrink: 0,
          }}>
            ←
          </Link>

          {/* Monogram */}
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 16, color: 'rgba(255,255,255,0.9)',
            flexShrink: 0,
          }}>
            {character.monogram}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 18, color: '#fff', letterSpacing: -0.3,
              lineHeight: 1.1,
            }}>
              {character.name}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.65)',
              marginTop: 1,
            }}>
              {character.role}
            </div>
          </div>

          {/* Online status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
            borderRadius: 99, padding: '4px 10px',
            border: '1px solid rgba(255,255,255,0.12)',
            flexShrink: 0,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4ade80', display: 'inline-block',
              animation: 'livePulse 1.5s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>
              Online
            </span>
          </div>
        </div>

        {/* Suggested prompts horizontal scroll */}
        <div style={{
          display: 'flex', gap: 6,
          overflowX: 'auto', paddingBottom: 12,
          scrollbarWidth: 'none',
        }}>
          {character.suggested.slice(0, 4).map(prompt => (
            <div key={prompt} style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 99, padding: '5px 12px',
              fontSize: 11, color: 'rgba(255,255,255,0.8)',
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              fontWeight: 500,
            }}>
              {prompt}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Navbar above the coloured header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200,
      }}>
        <Navbar />
      </div>

      {/* ── Chat area — fills remaining height ──────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ChatPanel character={character} compact />
      </div>

      <BottomNav />
    </div>
  )
}