import { notFound } from 'next/navigation'

import { Navbar } from '@/components/ui/Navbar'
import { Ticker } from '@/components/ui/Ticker'
import { BottomNav } from '@/components/ui/BottomNav'
import { ChatPanel } from '@/components/characters/ChatPanel'
import { ShareButton } from '@/components/characters/ShareButton'
import { CHARACTER_MAP } from '@/lib/constants'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const character = CHARACTER_MAP.get(id)
  if (!character) return { title: 'Character not found — KickoffTo' }
  return {
    title: `${character.name} — KickoffTo`,
    description: character.bio,
  }
}

export function generateStaticParams() {
  const chars = Array.from(CHARACTER_MAP.values()).filter(c => c.phase === 1)
  return chars.map(c => ({ id: c.id }))
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params
  const character = CHARACTER_MAP.get(id)
  if (!character) notFound()

  return (
    <>
      <Navbar />
      <Ticker segments={[
        `Chatting with ${character.name} · ${character.role}`,
        character.bio,
        `Share: kickoffto.com/characters/${character.id}`,
      ]} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${character.color}`,
            borderRadius: '0 12px 12px 0',
            padding: 20,
          }}>
            <a href="/characters" style={{
              fontSize: 12, color: 'var(--green)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16,
            }}>
              ← All characters
            </a>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: character.color,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 22, color: 'rgba(255,255,255,0.85)',
              marginBottom: 14,
            }}>
              {character.monogram}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 22, letterSpacing: -0.3,
              color: 'var(--text)', marginBottom: 4,
            }}>
              {character.name}
            </h1>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>
              {character.role} · {character.tier}
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 14, fontSize: 12, color: 'var(--green)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--green)', display: 'inline-block',
                animation: 'livePulse 1.5s ease-in-out infinite',
              }} />
              Online · Ready
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>
              {character.bio}
            </p>
            <ShareButton characterId={character.id} />
            <div style={{ marginTop: 14 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
              }}>
                Try asking
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {character.suggested.map(prompt => (
                  <div key={prompt} style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 8, padding: '8px 10px',
                    fontSize: 12, color: 'var(--text-2)',
                  }}>
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ChatPanel character={character} />
        </div>
      </main>
      <BottomNav />
    </>
  )
}