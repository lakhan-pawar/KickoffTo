'use client'
import { useEffect, useRef, useState } from 'react'
import { PositionAvatar } from './PositionAvatar'

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
  bronze: { border: '#8b5a2b', glow: 'rgba(139,90,43,0.4)', badge: '#cd7f32', text: 'Bronze' },
  silver: { border: '#708090', glow: 'rgba(112,128,144,0.3)', badge: '#c0c0c0', text: 'Silver' },
  gold:   { border: '#d4a017', glow: 'rgba(212,160,23,0.5)', badge: '#ffd700', text: 'Gold' },
  rainbow:{ border: '#9b59b6', glow: 'rgba(155,89,182,0.5)', badge: '#7c3aed', text: 'Rainbow Foil' },
}

const POSITION_MAP: Record<string, 'GK' | 'DEF' | 'MID' | 'ATT'> = {
  'GK': 'GK', 'GOALKEEPER': 'GK',
  'DEF': 'DEF', 'CB': 'DEF', 'LB': 'DEF', 'RB': 'DEF',
  'MID': 'MID', 'CM': 'MID', 'CAM': 'MID', 'CDM': 'MID',
  'ATT': 'ATT', 'ST': 'ATT', 'LW': 'ATT', 'RW': 'ATT', 'CF': 'ATT',
}

export function TradingCard({ player }: TradingCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [description, setDescription] = useState('')
  const [loadingDesc, setLoadingDesc] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)
  const [loadingPhoto, setLoadingPhoto] = useState(true)
  const photoImgRef = useRef<HTMLImageElement | null>(null)

  const rarity = RARITY_COLORS[player.rarity] ?? RARITY_COLORS.gold
  const kitColor = player.kitColors[0] ?? '#888888'
  const positionKey = player.position.toUpperCase()
  const svgPosition = POSITION_MAP[positionKey] ?? 'ATT'

  // Fetch photo from TheSportsDB via API route
  useEffect(() => {
    let cancelled = false
    async function fetchPhoto() {
      setLoadingPhoto(true)
      try {
        const res = await fetch(`/api/cards/${player.id}/photo`)
        if (!res.ok) throw new Error('No photo')
        const data = await res.json()
        if (!cancelled && data.cutout) {
          setPhotoUrl(data.cutout)
        } else if (!cancelled && data.thumb) {
          setPhotoUrl(data.thumb)
        } else {
          if (!cancelled) setPhotoFailed(true)
        }
      } catch {
        if (!cancelled) setPhotoFailed(true)
      } finally {
        if (!cancelled) setLoadingPhoto(false)
      }
    }
    fetchPhoto()
    return () => { cancelled = true }
  }, [player.id])

  // Draw card on canvas whenever photo state changes
  useEffect(() => {
    if (loadingPhoto) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 300
    const H = 420
    canvas.width = W
    canvas.height = H

    function drawCard(photoImg?: HTMLImageElement) {
      if (!ctx) return

      // Background
      ctx.fillStyle = '#0a0a0a'
      ctx.beginPath()
      ctx.roundRect(0, 0, W, H, 16)
      ctx.fill()

      // Kit colour gradient top
      const grad = ctx.createLinearGradient(0, 0, 0, 180)
      grad.addColorStop(0, kitColor + 'cc')
      grad.addColorStop(1, '#0a0a0a')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(0, 0, W, 180, [16, 16, 0, 0])
      ctx.fill()

      // Kit colour band at very top
      const kitColors = player.kitColors
      kitColors.forEach((color, i) => {
        ctx.fillStyle = color
        const segW = W / kitColors.length
        ctx.beginPath()
        ctx.roundRect(
          i * segW, 0,
          segW, 8,
          i === 0 ? [16, 0, 0, 0] : i === kitColors.length - 1 ? [0, 16, 0, 0] : 0
        )
        ctx.fill()
      })

      // WC2026 badge
      ctx.fillStyle = 'rgba(22,163,74,0.2)'
      ctx.fillRect(0, 8, W, 28)
      ctx.fillStyle = '#16a34a'
      ctx.font = 'bold 10px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('WC2026', W / 2, 26)

      // Photo or SVG area (36 to 185)
      if (photoImg) {
        // Draw real photo centred
        const photoH = 140
        const photoW = (photoImg.width / photoImg.height) * photoH
        const photoX = (W - photoW) / 2
        ctx.drawImage(photoImg, photoX, 38, photoW, photoH)

        // Vignette fade at bottom of photo
        const vignette = ctx.createLinearGradient(0, 140, 0, 185)
        vignette.addColorStop(0, 'rgba(10,10,10,0)')
        vignette.addColorStop(1, 'rgba(10,10,10,1)')
        ctx.fillStyle = vignette
        ctx.fillRect(0, 140, W, 45)
      } else {
        // Draw position label in photo area (SVG renders separately in DOM)
        ctx.fillStyle = kitColor + '33'
        ctx.fillRect(0, 36, W, 150)
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.font = 'bold 64px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(player.position, W / 2, 128)
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.font = '40px system-ui'
        ctx.fillText(player.flag, W / 2, 80)
      }

      // Name section
      const nameY = 198
      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 20px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(player.name, W / 2, nameY)

      ctx.fillStyle = '#a0a0a0'
      ctx.font = '11px system-ui'
      ctx.fillText(`${player.position} · ${player.nationality}`, W / 2, nameY + 18)
      ctx.fillText(player.club, W / 2, nameY + 32)

      // Divider
      ctx.strokeStyle = '#2a2a2a'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(20, nameY + 44)
      ctx.lineTo(W - 20, nameY + 44)
      ctx.stroke()

      // Stats
      const statsY = nameY + 68
      const stats = [
        { label: 'Goals', value: player.stats.goals },
        { label: 'Assists', value: player.stats.assists },
        { label: 'Apps', value: player.stats.appearances },
        { label: 'Rating', value: player.stats.rating > 0
            ? player.stats.rating.toFixed(1) : '-' },
      ]
      const colW = W / stats.length
      stats.forEach((stat, i) => {
        const cx = i * colW + colW / 2
        ctx.fillStyle = '#f5f5f5'
        ctx.font = 'bold 20px system-ui'
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

      // Rarity border with glow
      if (player.rarity === 'rainbow') {
        const time = Date.now() / 1000
        const gradient = ctx.createLinearGradient(0, 0, W, H)
        gradient.addColorStop(0, `hsl(${(time * 40) % 360}, 70%, 50%)`)
        gradient.addColorStop(0.5, `hsl(${(time * 40 + 180) % 360}, 70%, 50%)`)
        gradient.addColorStop(1, `hsl(${(time * 40 + 360) % 360}, 70%, 50%)`)
        ctx.strokeStyle = gradient
      } else {
        ctx.strokeStyle = rarity.border
      }
      
      ctx.shadowColor = rarity.glow
      ctx.shadowBlur = 12
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(1, 1, W - 2, H - 2, 15)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    if (photoUrl && !photoFailed) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        setPhotoLoaded(true)
        photoImgRef.current = img
        drawCard(img)
      }
      img.onerror = () => {
        setPhotoFailed(true)
        drawCard() // Draw without photo
      }
      img.src = photoUrl
    } else {
      drawCard()
    }

    // Animation loop for rainbow tier
    let animId: number
    if (player.rarity === 'rainbow') {
      const loop = () => {
        drawCard(photoImgRef.current || undefined)
        animId = requestAnimationFrame(loop)
      }
      animId = requestAnimationFrame(loop)
    }

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [player, photoUrl, photoFailed, loadingPhoto, kitColor, rarity, photoLoaded])

  // Fetch AI description
  useEffect(() => {
    let cancelled = false
    async function fetchDesc() {
      setLoadingDesc(true)
      try {
        const res = await fetch(`/api/cards/${player.id}/description`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!cancelled) setDescription(data.description ?? '')
      } catch {
        if (!cancelled) setDescription(
          `${player.fullName} is one of the standout performers at WC2026.`
        )
      }
      if (!cancelled) setLoadingDesc(false)
    }
    fetchDesc()
    return () => { cancelled = true }
  }, [player.id, player.fullName])

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
      {/* Card display */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          position: 'relative', borderRadius: 16, overflow: 'hidden',
          boxShadow: `0 0 20px ${rarity.glow}, 0 8px 32px rgba(0,0,0,0.6)`,
        }}>
          <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', borderRadius: 16 }} />

          {/* SVG avatar overlay when no photo */}
          {!photoLoaded && !loadingPhoto && (photoFailed || !photoUrl) && (
            <div style={{
              position: 'absolute', top: 36, left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}>
              <PositionAvatar
                position={svgPosition}
                kitColor={kitColor}
                accentColor={player.kitColors[1] ?? '#ffffff'}
                width={120}
                height={150}
              />
            </div>
          )}

          {/* Holographic shimmer */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              linear-gradient(120deg,
                transparent 0%,
                rgba(255,255,255,0.15) 40%,
                transparent 60%
              ),
              repeating-linear-gradient(
                45deg,
                rgba(255,0,150,0.04) 0px,
                rgba(0,200,255,0.04) 3px,
                rgba(0,255,200,0.04) 6px,
                rgba(255,255,0,0.04) 9px
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

      {/* Photo source indicator */}
      {!loadingPhoto && (
        <div style={{
          textAlign: 'center', marginBottom: 12,
          fontSize: 10, color: 'var(--text-3)',
        }}>
          {photoLoaded
            ? '📸 Photo via TheSportsDB'
            : `🎨 ${svgPosition} illustrated avatar`}
        </div>
      )}

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

      {/* Download + Share */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={downloadCard} style={{
          flex: 1, background: 'var(--green)', color: '#fff',
          border: 'none', borderRadius: 10, padding: '12px 16px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          opacity: downloading ? 0.7 : 1,
        }}>
          {downloading ? '↓ Downloading...' : '↓ Download PNG'}
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(`${window.location.origin}/cards/${player.id}`)
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
