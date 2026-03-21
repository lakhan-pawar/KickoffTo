'use client'
import { useEffect, useRef, useState } from 'react'

interface Player {
  id: string
  name: string
  fullName: string
  position: string
  nationality: string
  flag: string
  club: string
  photo: string | null
  kitColors: string[]
  stats: { goals: number; assists: number; appearances: number; rating: number }
  rarity: 'bronze' | 'silver' | 'gold' | 'rainbow'
}

interface TradingCardProps {
  player: Player
}

const RARITY_COLORS = {
  bronze: { bg: '#3a2a1a', border: '#8b5a2b', badge: '#cd7f32', text: 'Bronze' },
  silver: { bg: '#1a1a2a', border: '#708090', badge: '#c0c0c0', text: 'Silver' },
  gold:   { bg: '#2a1a00', border: '#d4a017', badge: '#ffd700', text: 'Gold' },
  rainbow:{ bg: '#1a0a2a', border: '#9b59b6', badge: '#7c3aed', text: 'Rainbow Foil' },
}

export function TradingCard({ player }: TradingCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [description, setDescription] = useState<string>('')
  const [loadingDesc, setLoadingDesc] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const rarity = RARITY_COLORS[player.rarity] ?? RARITY_COLORS.gold

  // Draw card on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 300
    const H = 420
    canvas.width = W
    canvas.height = H

    // Background
    ctx.fillStyle = '#0a0a0a'
    // ctx.roundRect is not always available in older browsers but we assume modern env
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(0, 0, W, H, 16)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, W, H)
    }

    // Kit colour band at top
    const kitColors = player.kitColors
    const bandH = 10
    kitColors.forEach((color, i) => {
      ctx.fillStyle = color
      const segW = W / kitColors.length
      ctx.fillRect(i * segW, 0, segW, bandH)
    })

    // WC2026 badge area
    ctx.fillStyle = 'rgba(22,163,74,0.15)'
    ctx.fillRect(0, bandH, W, 30)
    ctx.fillStyle = '#16a34a'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('WC2026', W / 2, bandH + 19)

    // Player photo placeholder
    const photoY = bandH + 30
    const photoH = 160
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, photoY, W, photoH)

    // Position initials in photo area
    ctx.fillStyle = '#2a2a2a'
    ctx.font = 'bold 48px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(player.position, W / 2, photoY + photoH / 2 + 16)

    // Player flag
    ctx.font = '28px system-ui'
    ctx.fillText(player.flag, W / 2, photoY + photoH / 2 - 20)

    // Name section
    const nameY = photoY + photoH + 14
    ctx.fillStyle = '#f5f5f5'
    ctx.font = 'bold 22px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(player.name, W / 2, nameY)

    ctx.fillStyle = '#a0a0a0'
    ctx.font = '11px system-ui'
    ctx.fillText(`${player.position} · ${player.nationality}`, W / 2, nameY + 18)

    // Divider
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, nameY + 28)
    ctx.lineTo(W - 20, nameY + 28)
    ctx.stroke()

    // Stats
    const statsY = nameY + 46
    const stats = [
      { label: 'Goals', value: player.stats.goals },
      { label: 'Assists', value: player.stats.assists },
      { label: 'Apps', value: player.stats.appearances },
      { label: 'Rating', value: player.stats.rating.toFixed(1) },
    ]
    const colW = W / stats.length
    stats.forEach((stat, i) => {
      const cx = i * colW + colW / 2
      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 18px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(String(stat.value), cx, statsY)
      ctx.fillStyle = '#5a5a5a'
      ctx.font = '9px system-ui'
      ctx.fillText(stat.label.toUpperCase(), cx, statsY + 14)
    })

    // Rarity badge
    ctx.fillStyle = rarity.badge
    ctx.font = 'bold 9px system-ui'
    ctx.textAlign = 'right'
    ctx.fillText(rarity.text.toUpperCase(), W - 12, H - 12)

    // KickoffTo watermark
    ctx.fillStyle = '#2a2a2a'
    ctx.font = '9px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('kickoffto.com', 12, H - 12)

    // Rarity border
    ctx.strokeStyle = rarity.border
    ctx.lineWidth = 1.5
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(1, 1, W - 2, H - 2, 15)
      ctx.stroke()
    } else {
      ctx.strokeRect(1, 1, W - 2, H - 2)
    }

  }, [player, rarity])

  // Fetch AI description
  useEffect(() => {
    let cancelled = false
    async function fetchDesc() {
      setLoadingDesc(true)
      try {
        const res = await fetch(`/api/cards/${player.id}/description`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!cancelled) setDescription(data.description)
      } catch {
        if (!cancelled) setDescription(
          `${player.fullName} represents ${player.nationality} at WC2026 with distinction and skill.`
        )
      }
      if (!cancelled) setLoadingDesc(false)
    }
    fetchDesc()
    return () => { cancelled = true }
  }, [player.id, player.fullName, player.nationality])

  function downloadCard() {
    const canvas = canvasRef.current
    if (!canvas) return
    setDownloading(true)
    const link = document.createElement('a')
    link.download = `kickoffto-${player.id}-wc2026.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setTimeout(() => setDownloading(false), 1000)
  }

  return (
    <div>
      {/* Card with holographic shimmer overlay */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 20,
      }}>
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              maxWidth: '100%',
              borderRadius: 16,
            }}
          />
          {/* Holographic shimmer overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              linear-gradient(120deg,
                transparent 0%,
                rgba(255,255,255,0.18) 40%,
                transparent 60%
              ),
              repeating-linear-gradient(
                45deg,
                rgba(255,0,150,0.05) 0px,
                rgba(0,200,255,0.05) 3px,
                rgba(0,255,200,0.05) 6px,
                rgba(255,255,0,0.05) 9px
              )
            `,
            mixBlendMode: 'screen',
            backgroundSize: '200% 100%, 20px 20px',
            animation: 'shimmer 4s linear infinite',
            pointerEvents: 'none',
            borderRadius: 16,
          }} />
        </div>
      </div>

      {/* AI Description */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px', marginBottom: 16,
      }}>
        <p style={{
          fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65,
          fontStyle: 'italic', margin: 0,
        }}>
          {loadingDesc ? 'Generating card description...' : `"${description}"`}
        </p>
        {!loadingDesc && (
          <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>
            — El Maestro · KickoffTo WC2026
          </p>
        )}
      </div>

      {/* Download + Share buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={downloadCard}
          style={{
            flex: 1, background: 'var(--green)', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '12px 16px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer',
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? '↓ Downloading...' : '↓ Download PNG'}
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              `${window.location.origin}/cards/${player.id}`
            )
            alert('Card link copied!')
          }}
          style={{
            flex: 1, background: 'var(--bg-elevated)', color: 'var(--text-2)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '12px 16px', fontSize: 13, cursor: 'pointer',
          }}
        >
          Share card
        </button>
      </div>
    </div>
  )
}
