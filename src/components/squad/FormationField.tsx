// src/components/squad/FormationField.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { SquadPlayer } from '@/lib/players'

interface Position {
  id: string
  label: string
  x: number
  y: number
}

const FORMATION_433: Position[] = [
  { id: 'gk', label: 'GK', x: 50, y: 85 },
  { id: 'rb', label: 'RB', x: 85, y: 65 },
  { id: 'rcb', label: 'CB', x: 65, y: 65 },
  { id: 'lcb', label: 'CB', x: 35, y: 65 },
  { id: 'lb', label: 'LB', x: 15, y: 65 },
  { id: 'cm1', label: 'CM', x: 50, y: 45 },
  { id: 'cm2', label: 'CM', x: 25, y: 45 },
  { id: 'cm3', label: 'CM', x: 75, y: 45 },
  { id: 'rw', label: 'RW', x: 80, y: 15 },
  { id: 'st', label: 'ST', x: 50, y: 10 },
  { id: 'lw', label: 'LW', x: 20, y: 15 },
]

interface Props {
  selectedPlayers: Record<string, SquadPlayer | null>
  onSelectPosition: (posId: string) => void
}

export default function FormationField({ selectedPlayers, onSelectPosition }: Props) {
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '3/4',
      width: '100%',
      maxWidth: 500,
      margin: '0 auto',
      background: 'var(--green)',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '4px solid rgba(0, 0, 0, 0.2)',
    }}>
      {/* Pitch Lines */}
      <div style={{ position: 'absolute', inset: 16, border: '2px solid rgba(255,255,255,0.2)', borderRadius: 16 }} />
      <div style={{ position: 'absolute', top: '50%', left: 16, right: 16, height: 2, background: 'rgba(255,255,255,0.2)' }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 100, height: 100, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%'
      }} />
      
      {/* Penalty Areas */}
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: 200, height: 100, border: '2px solid rgba(255,255,255,0.2)', borderTop: 'none' }} />
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 200, height: 100, border: '2px solid rgba(255,255,255,0.2)', borderBottom: 'none' }} />

      {/* Players */}
      {FORMATION_433.map((pos) => {
        const player = selectedPlayers[pos.id]
        
        const PlayerElement = (
          <div
            key={pos.id}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: '50%', border: '2px solid #fff',
              background: player ? '#fff' : 'rgba(22, 163, 74, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 1, 0.3)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
            >
              {player ? (
                <img 
                  src={`https://flagcdn.com/w80/${player.countryCode}.png`} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>+</span>
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase',
              background: player ? '#fff' : 'rgba(0, 50, 0, 0.4)',
              color: player ? '#000' : 'rgba(255,255,255,0.7)',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              {player ? player.name.split(' ').pop() : pos.label}
            </span>
          </div>
        )

        if (player) {
          return (
            <Link href={`/players/${player.id}`} key={pos.id}>
              {PlayerElement}
            </Link>
          )
        }

        return (
          <button
            key={pos.id}
            onClick={() => onSelectPosition(pos.id)}
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
          >
            {PlayerElement}
          </button>
        )
      })}
    </div>
  )
}
