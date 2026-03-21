import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { TradingCard } from '@/components/cards/TradingCard'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ playerId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { playerId } = await params
  return {
    title: `Player Card — KickoffTo`,
    description: `Generate a WC2026 player trading card for ${playerId}. Download as PNG.`,
  }
}

// Mock player data — replace with API-Football data in production
function getMockPlayer(playerId: string) {
  const players: Record<string, any> = {
    'messi': {
      id: 'messi', name: 'L. Messi', fullName: 'Lionel Messi',
      position: 'ATT', nationality: 'Argentina', flag: '🇦🇷',
      club: 'Inter Miami', photo: null,
      kitColors: ['#75aadb', '#ffffff'],
      stats: { goals: 6, assists: 4, appearances: 7, rating: 9.2 },
      rarity: 'gold',
    },
    'mbappe': {
      id: 'mbappe', name: 'K. Mbappé', fullName: 'Kylian Mbappé',
      position: 'ATT', nationality: 'France', flag: '🇫🇷',
      club: 'Real Madrid', photo: null,
      kitColors: ['#003087', '#ffffff'],
      stats: { goals: 5, assists: 3, appearances: 7, rating: 8.9 },
      rarity: 'gold',
    },
    'davies': {
      id: 'davies', name: 'A. Davies', fullName: 'Alphonso Davies',
      position: 'DEF', nationality: 'Canada', flag: '🇨🇦',
      club: 'Bayern Munich', photo: null,
      kitColors: ['#e31837', '#ffffff'],
      stats: { goals: 1, assists: 3, appearances: 6, rating: 8.1 },
      rarity: 'silver',
    },
  }
  return players[playerId] ?? players['messi']
}

export default async function CardPage({ params }: PageProps) {
  const { playerId } = await params
  const player = getMockPlayer(playerId)

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px 100px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 24, letterSpacing: -0.3, color: 'var(--text)', marginBottom: 4,
        }}>
          Trading Card
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>
          WC2026 · {player.fullName} · {player.nationality}
        </p>

        <TradingCard player={player} />

        {/* Quick links to other players */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Try other players
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['messi', 'mbappe', 'davies'].filter(id => id !== playerId).map(id => (
              <a key={id} href={`/cards/${id}`} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 12px', fontSize: 12,
                color: 'var(--text-2)', textDecoration: 'none',
                textTransform: 'capitalize',
              }}>
                {id} →
              </a>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
