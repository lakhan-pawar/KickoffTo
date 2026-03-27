// src/app/games/dream-squad/page.tsx
'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import FormationField from '@/components/squad/FormationField'
import teamsData from '@/data/teams.json'
import type { SquadPlayer } from '@/lib/players'

export default function DreamSquadPage() {
  const [selectedPos, setSelectedPos] = useState<string | null>(null)
  const [squad, setSquad] = useState<Record<string, SquadPlayer | null>>({})
  const [search, setSearch] = useState('')

  const handleSelectPlayer = (player: { id: number; name: string; code: string; rank: number }) => {
    if (!selectedPos) return
    const squadPlayer: SquadPlayer = {
      id: player.id,
      name: player.name,
      age: 27,
      position: selectedPos.toUpperCase(),
      photo: '',
      club: 'National Team',
      clubLogo: `https://flagcdn.com/w40/${player.code}.png`,
      shirtNumber: 10,
      nationality: player.name,
      countryCode: player.code,
      injured: false
    }
    setSquad(prev => ({ ...prev, [selectedPos]: squadPlayer }))
    setSelectedPos(null)
    setSearch('')
  }

  const filteredPlayers = teamsData.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const isComplete = Object.keys(squad).length === 11

  return (
    <>
      <Navbar />
      <Ticker segments={[
        '⚽ Create your Dream XI',
        'Pick from all qualified nations',
        'Share your tactical masterpiece',
      ]} />
      
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 42px)', letterSpacing: -1, color: 'var(--text)', marginBottom: 4 }}>
              DREAM SQUAD XI
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Pick your 4-3-3 tactical masterpiece.</p>
          </div>
          {isComplete && (
             <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: 12 }}>
               📤 Share XI
             </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <FormationField 
                selectedPlayers={squad} 
                onSelectPosition={setSelectedPos} 
              />
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {selectedPos ? (
                <div style={{
                  padding: 24, borderRadius: 20, border: '2px solid var(--green)', background: 'var(--bg-card)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Select {selectedPos.toUpperCase()}
                    </h3>
                    <button onClick={() => setSelectedPos(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-3)' }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</div>
                    <input
                      type="search"
                      placeholder="Search countries..."
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 12px 12px 40px', borderRadius: 12, border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)', color: 'var(--text)', outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 8 }}>
                    {filteredPlayers.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectPlayer(t)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10,
                          background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', transition: 'background 0.1s'
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--border-mid)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={`https://flagcdn.com/w40/${t.code}.png`} alt="" style={{ width: 24, height: 16, borderRadius: 2, objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{t.name} XI</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>RANK #{t.rank}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: 32, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-card)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16
                }}>
                   <div style={{ fontSize: 40, opacity: 0.5 }}>✨</div>
                   <div>
                     <h3 style={{ fontWeight: 800, marginBottom: 4 }}>Tactical Hub</h3>
                     <p style={{ fontSize: 13, color: 'var(--text-3)', maxWidth: 300 }}>
                        Select a position on the pitch to assign a nation&apos;s representative to your Dream XI.
                     </p>
                   </div>
                   
                   {isComplete && (
                     <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)', width: '100%' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', fontStyle: 'italic' }}>
                          &quot;A balanced squad with strong ranks. This 4-3-3 formation looks set for a deep tournament run.&quot;
                        </p>
                     </div>
                   )}
                </div>
              )}

              <div style={{ padding: 24, borderRadius: 20, background: '#111', border: '1px solid var(--border)', color: '#fff' }}>
                <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 12 }}>
                  Selection Rules
                </h4>
                <ul style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text-2)', listStyle: 'none' }}>
                   <li>• One nation can only be used once (optional)</li>
                   <li>• Mix confederations for chemistry</li>
                   <li>• AI Scout reports unlock after 11 picks</li>
                </ul>
              </div>
           </div>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
