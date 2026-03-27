'use client'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import Link from 'next/link'
import type { Metadata } from 'next'


const CARD_FLAGS: Record<string,string> = {
  messi:'ar', mbappe:'fr', davies:'ca', bellingham:'gb-eng',
  vinicius:'br', yamal:'es', wirtz:'de', pulisic:'us',
  hakimi:'ma', haaland:'no', kane:'gb-eng', salah:'eg',
  ronaldo:'pt', neymar:'br', osimhen:'ng', son:'kr',
}

const FEATURED_PLAYERS = [
  { id: 'messi', name: 'L. Messi', flag: '🇦🇷', position: 'ATT',
    club: 'Inter Miami', rarity: 'gold', kitColor: '#75aadb' },
  { id: 'mbappe', name: 'K. Mbappé', flag: '🇫🇷', position: 'ATT',
    club: 'Real Madrid', rarity: 'gold', kitColor: '#003087' },
  { id: 'davies', name: 'A. Davies', flag: '🇨🇦', position: 'DEF',
    club: 'Bayern Munich', rarity: 'silver', kitColor: '#e31837' },
  { id: 'bellingham', name: 'J. Bellingham', flag: '🏴', position: 'MID',
    club: 'Real Madrid', rarity: 'gold', kitColor: '#cf081f' },
  { id: 'vinicius', name: 'Vinicius Jr.', flag: '🇧🇷', position: 'ATT',
    club: 'Real Madrid', rarity: 'gold', kitColor: '#f7e03b' },
  { id: 'yamal', name: 'L. Yamal', flag: '🇪🇸', position: 'ATT',
    club: 'FC Barcelona', rarity: 'gold', kitColor: '#d4213d' },
  { id: 'wirtz', name: 'F. Wirtz', flag: '🇩🇪', position: 'MID',
    club: 'Bayer Leverkusen', rarity: 'silver', kitColor: '#3c3c3c' },
  { id: 'pulisic', name: 'C. Pulisic', flag: '🇺🇸', position: 'ATT',
    club: 'AC Milan', rarity: 'silver', kitColor: '#b22234' },
  { id: 'hakimi', name: 'A. Hakimi', flag: '🇲🇦', position: 'DEF',
    club: 'PSG', rarity: 'silver', kitColor: '#c1272d' },
  { id: 'haaland', name: 'E. Haaland', flag: '🇳🇴', position: 'ATT',
    club: 'Man City', rarity: 'gold', kitColor: '#97c1e7' },
  { id: 'kane', name: 'H. Kane', flag: '🏴', position: 'ATT',
    club: 'Bayern Munich', rarity: 'silver', kitColor: '#cf081f' },
  { id: 'salah', name: 'M. Salah', flag: '🇪🇬', position: 'ATT',
    club: 'Liverpool', rarity: 'gold', kitColor: '#c8102e' },
  { id: 'ronaldo', name: 'C. Ronaldo', flag: '🇵🇹', position: 'ATT',
    club: 'Al-Nassr', rarity: 'rainbow', kitColor: '#ffdd00' },
  { id: 'neymar', name: 'Neymar Jr', flag: '🇧🇷', position: 'ATT',
    club: 'Al-Hilal', rarity: 'gold', kitColor: '#2546ad' },
  { id: 'osimhen', name: 'V. Osimhen', flag: '🇳🇬', position: 'ATT',
    club: 'Galatasaray', rarity: 'gold', kitColor: '#c1272d' },
  { id: 'son', name: 'Son H.M.', flag: '🇰🇷', position: 'ATT',
    club: 'Tottenham', rarity: 'gold', kitColor: '#ffffff' },
]

const RARITY_BADGE: Record<string, { color: string; label: string }> = {
  bronze: { color: '#cd7f32', label: 'Bronze' },
  silver: { color: '#c0c0c0', label: 'Silver' },
  gold:   { color: '#ffd700', label: 'Gold' },
  rainbow:{ color: '#7c3aed', label: '🌈' },
}

export default function CardsIndexPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 100px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(24px, 4vw, 40px)',
          letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
        }}>
          TRADING CARDS
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
          WC2026 player cards · Download PNG · Powered by TheSportsDB + Groq
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 10,
        }}>
          {FEATURED_PLAYERS.map(player => {
            const badge = RARITY_BADGE[player.rarity]
            return (
              <Link
                key={player.id}
                href={`/cards/${player.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="card-hover-el"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12, padding: 14,
                    position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.15s, transform 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  {/* Kit colour strip */}
                  <div style={{
                    height: 4, borderRadius: 2,
                    background: player.kitColor, marginBottom: 10,
                  }} />

                  <img
                    src={`https://flagcdn.com/w40/${CARD_FLAGS[player.id] ?? 'un'}.png`}
                    alt={player.id}
                    width={26} height={18}
                    style={{ objectFit:'cover', borderRadius:3, verticalAlign:'middle', flexShrink:0, marginBottom: 6 }}
                  />

                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 13,
                    fontWeight: 700, color: 'var(--text)', marginBottom: 2,
                  }}>
                    {player.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 8 }}>
                    {player.position} · {player.club}
                  </div>

                  {/* Rarity badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 9, fontWeight: 700,
                    color: badge.color,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: badge.color, display: 'inline-block',
                    }} />
                    {badge.label}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        <p style={{
          fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 20,
        }}>
          Full squad cards available from June 11 when squads are confirmed ·
          Photos via TheSportsDB
        </p>
      </main>
      <BottomNav />
    </>
  )
}
