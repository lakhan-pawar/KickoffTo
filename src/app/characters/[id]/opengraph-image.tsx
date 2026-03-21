import { ImageResponse } from 'next/og'
import { CHARACTER_MAP } from '@/lib/constants'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const character = CHARACTER_MAP.get(id)
  
  if (!character) {
    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#16a34a', fontSize: 48, fontWeight: 800,
      }}>
        KickoffTo
      </div>
    )
  }
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', padding: '0 80px', gap: 60,
    }}>
      <div style={{
        width: 160, height: 160, borderRadius: 28,
        background: character.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 56, fontWeight: 800, color: 'rgba(255,255,255,0.85)',
        flexShrink: 0,
      }}>
        {character.monogram}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#16a34a',
          textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          KickoffTo · WC2026
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#f5f5f5',
          letterSpacing: -1, lineHeight: 1 }}>
          {character.name}
        </div>
        <div style={{ fontSize: 28, color: '#a0a0a0' }}>{character.role}</div>
      </div>
    </div>
  )
}
