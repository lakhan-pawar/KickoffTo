'use client'
import { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import Link from 'next/link'

const TEAMS = [
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  { code: 'FRA', name: 'France', flag: '🇫🇷' },
  { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
  { code: 'ENG', name: 'England', flag: '🏴' },
  { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
  { code: 'GER', name: 'Germany', flag: '🇩🇪' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NED', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
  { code: 'USA', name: 'USA', flag: '🇺🇸' },
  { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'MAR', name: 'Morocco', flag: '🇲🇦' },
  { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾' },
]

const STYLES = [
  { id: 'terrace', label: 'Terrace', emoji: '📣', desc: 'Classic football chant' },
  { id: 'melodic', label: 'Melodic', emoji: '🎵', desc: 'Sung to a famous tune' },
  { id: 'sarcastic', label: 'Sarcastic', emoji: '😏', desc: 'For the opposition' },
  { id: 'epic', label: 'Epic', emoji: '🏆', desc: 'Tournament anthem' },
]

export default function ChantPage() {
  const [team, setTeam] = useState('CAN')
  const [style, setStyle] = useState('terrace')
  const [chant, setChant] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const selectedTeam = TEAMS.find(t => t.code === team)!

  async function generate() {
    setLoading(true)
    setError('')
    setChant('')

    try {
      const res = await fetch('/api/games/chant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: selectedTeam.name, style }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      setChant(data.chant ?? '')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate chant')
    } finally {
      setLoading(false)
    }
  }

  function copyChant() {
    navigator.clipboard?.writeText(chant)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 100px' }}>
        <Link href="/games" style={{
          fontSize: 12, color: 'var(--green)', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20,
        }}>
          ← Games
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 28, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 6,
        }}>
          CHANT CREATOR
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>
          Generate a WC2026 terrace chant for any team. Share it. Start it in the stands.
        </p>

        {/* Team picker */}
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
          }}>
            Team
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: 6,
          }}>
            {TEAMS.map(t => (
              <button
                key={t.code}
                onClick={() => setTeam(t.code)}
                style={{
                  background: team === t.code ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  border: `1px solid ${team === t.code ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '8px 6px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, color: team === t.code ? 'var(--text)' : 'var(--text-2)',
                  fontWeight: team === t.code ? 600 : 400,
                }}
              >
                <span style={{ fontSize: 16 }}>{t.flag}</span>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Style picker */}
        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
          }}>
            Chant style
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                style={{
                  background: style === s.id ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  border: `1px solid ${style === s.id ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                  textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <div>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: style === s.id ? 'var(--text)' : 'var(--text-2)',
                  }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                    {s.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: '100%', background: loading ? 'var(--bg-elevated)' : 'var(--green)',
            color: loading ? 'var(--text-3)' : '#fff',
            border: 'none', borderRadius: 10, padding: '14px 20px',
            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 20,
          }}
        >
          {loading ? `Writing ${selectedTeam.name} chant...` : `${selectedTeam.flag} Generate chant →`}
        </button>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
            fontSize: 13, color: 'var(--red-card)',
          }}>
            {error}
          </div>
        )}

        {chant && (
          <div>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 20, marginBottom: 12,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {selectedTeam.flag} {selectedTeam.name} ·{' '}
                  {STYLES.find(s => s.id === style)?.label} chant
                </div>
              </div>
              <pre style={{
                fontFamily: 'var(--font-display)',
                fontSize: 15, fontWeight: 600,
                color: 'var(--text)', lineHeight: 1.9,
                whiteSpace: 'pre-wrap', margin: 0,
              }}>
                {chant}
              </pre>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={copyChant} style={{
                flex: 1, background: copied ? 'var(--bg-elevated)' : 'var(--green)',
                color: copied ? 'var(--green)' : '#fff',
                border: `1px solid ${copied ? 'var(--green)' : 'transparent'}`,
                borderRadius: 10, padding: '10px', fontSize: 13,
                fontWeight: 600, cursor: 'pointer',
              }}>
                {copied ? '✓ Chant copied!' : '📋 Copy chant'}
              </button>
              <button onClick={generate} style={{
                flex: 1, background: 'var(--bg-elevated)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px', fontSize: 13, color: 'var(--text-2)',
                cursor: 'pointer',
              }}>
                🔄 New chant
              </button>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
