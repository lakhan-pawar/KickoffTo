import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { groqChat } from '@/lib/groq'
import { getCache, setCache, CACHE_KEYS } from '@/lib/redis'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ matchId: string }>
}

const MOCK_MATCHES: Record<string, any> = {
  'mock-arg-fra': {
    id: 'mock-arg-fra',
    homeTeam: { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
    awayTeam: { name: 'France', flag: '🇫🇷', code: 'FRA' },
    round: 'Group A', venue: 'MetLife Stadium',
    kickoff: '2026-06-14T20:00:00Z',
  },
  'mock-bra-esp': {
    id: 'mock-bra-esp',
    homeTeam: { name: 'Brazil', flag: '🇧🇷', code: 'BRA' },
    awayTeam: { name: 'Spain', flag: '🇪🇸', code: 'ESP' },
    round: 'Group C', venue: 'AT&T Stadium',
    kickoff: '2026-06-16T20:00:00Z',
  },
}

async function getMatchPreview(match: any): Promise<string> {
  const cacheKey = CACHE_KEYS.matchPreview(match.id)
  const cached = await getCache<{ preview: string }>(cacheKey)
  if (cached) return cached.preview

  try {
    const preview = await groqChat(
      [{
        role: 'user',
        content: `Write a 3-paragraph match preview for ${match.homeTeam.name} vs ${match.awayTeam.name} at WC2026.
${match.round} · ${match.venue}

Paragraph 1: Overall tactical matchup — what makes this game interesting
Paragraph 2: Key battle to watch — one specific player vs player duel
Paragraph 3: Prediction and what would need to happen for an upset

Style: authoritative, tactical, engaging. Like a premium sports preview.`,
      }],
      'llama-3.3-70b-versatile',
      400,
      'You are El Maestro, the tactical analyst at KickoffTo.',
    )

    await setCache(cacheKey, { preview: preview.trim() }, 86400)
    return preview.trim()
  } catch {
    return `${match.homeTeam.name} face ${match.awayTeam.name} in what promises to be a fascinating tactical encounter at ${match.venue}. Both sides arrive with clear identities and the tactical battle in midfield will likely decide this fixture. This is a match where the margins are fine and the quality is high — expect a closely contested game decided by individual brilliance or a set piece.`
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { matchId } = await params
  const match = MOCK_MATCHES[matchId]
  if (!match) return { title: 'Match Preview — KickoffTo' }
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} Preview — KickoffTo`,
    description: `WC2026 match preview: ${match.homeTeam.name} vs ${match.awayTeam.name}. ${match.round} · ${match.venue}`,
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { matchId } = await params
  const match = MOCK_MATCHES[matchId] ?? MOCK_MATCHES['mock-arg-fra']
  const preview = await getMatchPreview(match)
  const paragraphs = preview.split('\n\n').filter(Boolean)

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 100px' }}>

        {/* Match header */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24, marginBottom: 20,
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700, color: 'var(--green)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
          }}>
            Match Preview · {match.round} · WC2026
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 52 }}>{match.homeTeam.flag}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 16,
                fontWeight: 800, color: 'var(--text)', marginTop: 8,
              }}>
                {match.homeTeam.name}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 18,
                fontWeight: 900, color: 'var(--text-3)',
              }}>
                vs
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>
                {match.venue}
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 52 }}>{match.awayTeam.flag}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 16,
                fontWeight: 800, color: 'var(--text)', marginTop: 8,
              }}>
                {match.awayTeam.name}
              </div>
            </div>
          </div>
        </div>

        {/* Preview text */}
        <div style={{
          background: 'color-mix(in srgb, #1e3a5f 4%, var(--bg-card))',
          border: '1px solid var(--border)',
          borderLeft: '3px solid #1e3a5f',
          borderRadius: '0 12px 12px 0',
          padding: 20, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: '#1e3a5f',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 10, color: 'rgba(255,255,255,0.85)',
            }}>EM</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
              El Maestro · Pre-Match Analysis
            </span>
          </div>
          {paragraphs.map((para, i) => (
            <p key={i} style={{
              fontSize: 14, color: 'var(--text-2)',
              lineHeight: 1.75, marginBottom: i < paragraphs.length - 1 ? 16 : 0,
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* Quick action links */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href={`/live/${match.id}`} style={{
            flex: 1, background: 'var(--green)', color: '#fff',
            textDecoration: 'none', borderRadius: 10, padding: '12px 16px',
            fontSize: 13, fontWeight: 700, textAlign: 'center', minWidth: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            ⚡ Live room →
          </Link>
          <Link href={`/director/${match.id}`} style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', color: 'var(--text-2)',
            textDecoration: 'none', borderRadius: 10, padding: '12px 16px',
            fontSize: 13, textAlign: 'center', minWidth: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            🎬 Director mode
          </Link>
          <Link href="/characters/el-maestro" style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', color: 'var(--text-2)',
            textDecoration: 'none', borderRadius: 10, padding: '12px 16px',
            fontSize: 13, textAlign: 'center', minWidth: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            💬 Ask El Maestro
          </Link>
        </div>

      </main>
      <BottomNav />
    </>
  )
}
