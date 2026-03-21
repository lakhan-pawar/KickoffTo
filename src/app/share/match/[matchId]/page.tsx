'use client'
import { useRef, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'

const MOCK_MATCHES: Record<string, any> = {
  'mock-arg-fra': {
    homeTeam: { name: 'Argentina', code: 'AR', kitColor: '#75aadb' },
    awayTeam: { name: 'France', code: 'FR', kitColor: '#003087' },
    homeScore: 2, awayScore: 1,
    round: 'Group B', venue: 'MetLife Stadium',
    keyMoments: ["23' ⚽ L. Messi (ARG)", "45' ⚽ K. Mbappé (FRA)", "67' ⚽ L. Messi pen (ARG)"],
  },
}

export default function ShareMatchPage() {
  const params = useParams()
  const matchId = params?.matchId as string
  const match = MOCK_MATCHES[matchId] ?? MOCK_MATCHES['mock-arg-fra']
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [downloaded, setDownloaded] = useState(false)
  const [flagsLoaded, setFlagsLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1080, H = 1920
    canvas.width = W
    canvas.height = H

    // Load flag images from flagcdn.com (works in Canvas, cross-origin)
    const homeImg = new Image()
    const awayImg = new Image()
    homeImg.crossOrigin = 'anonymous'
    awayImg.crossOrigin = 'anonymous'

    let loaded = 0
    function onLoad() {
      loaded++
      if (loaded === 2) drawCard(homeImg, awayImg)
    }
    function onError() {
      loaded++
      if (loaded === 2) drawCard()
    }

    homeImg.onload = onLoad; homeImg.onerror = onError
    awayImg.onload = onLoad; awayImg.onerror = onError
    homeImg.src = `https://flagcdn.com/w160/${match.homeTeam.code.toLowerCase()}.png`
    awayImg.src = `https://flagcdn.com/w160/${match.awayTeam.code.toLowerCase()}.png`

    function drawCard(homeFlag?: HTMLImageElement, awayFlag?: HTMLImageElement) {
      if (!ctx) return

      // Dark background
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)

      // Split kit gradient halves
      const lg = ctx.createLinearGradient(0, 0, W * 0.6, 0)
      lg.addColorStop(0, match.homeTeam.kitColor + '55')
      lg.addColorStop(1, 'transparent')
      ctx.fillStyle = lg
      ctx.fillRect(0, 0, W * 0.6, H * 0.6)

      const rg = ctx.createLinearGradient(W * 0.4, 0, W, 0)
      rg.addColorStop(0, 'transparent')
      rg.addColorStop(1, match.awayTeam.kitColor + '55')
      ctx.fillStyle = rg
      ctx.fillRect(W * 0.4, 0, W * 0.6, H * 0.6)

      // KickoffTo header
      ctx.fillStyle = '#16a34a'
      ctx.font = 'bold 44px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('KickoffTo · WC2026', W / 2, 120)
      ctx.fillStyle = '#555'
      ctx.font = '34px system-ui'
      ctx.fillText(`${match.round} · ${match.venue}`, W / 2, 172)

      // Flag images or text fallback
      const flagSize = 220
      if (homeFlag) {
        ctx.save()
        ctx.shadowColor = match.homeTeam.kitColor
        ctx.shadowBlur = 30
        ctx.drawImage(homeFlag, W / 4 - flagSize / 2, 280, flagSize, flagSize * 0.67)
        ctx.restore()
      } else {
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 80px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(match.homeTeam.code, W / 4, 380)
      }

      if (awayFlag) {
        ctx.save()
        ctx.shadowColor = match.awayTeam.kitColor
        ctx.shadowBlur = 30
        ctx.drawImage(awayFlag, W * 3 / 4 - flagSize / 2, 280, flagSize, flagSize * 0.67)
        ctx.restore()
      } else {
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 80px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(match.awayTeam.code, W * 3 / 4, 380)
      }

      // Score — the hero
      ctx.fillStyle = '#f0f0f0'
      ctx.font = 'bold 240px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(`${match.homeScore}–${match.awayScore}`, W / 2, 760)

      // Team names
      ctx.font = 'bold 56px system-ui'
      ctx.fillText(match.homeTeam.name, W / 4, 840)
      ctx.fillText(match.awayTeam.name, W * 3 / 4, 840)

      // Divider
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(80, 880, W - 160, 1)

      // Key moments
      ctx.fillStyle = '#f0f0f0'
      ctx.font = 'bold 38px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText('KEY MOMENTS', 80, 960)
      ctx.fillStyle = '#888'
      ctx.font = '40px system-ui'
      match.keyMoments.forEach((m: string, i: number) => {
        ctx.fillText(m, 80, 1040 + i * 74)
      })

      // URL
      ctx.fillStyle = '#333'
      ctx.font = '30px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('kickoffto.com', W / 2, H - 80)

      setFlagsLoaded(true)
    }
  }, [match])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `kickoffto-match-${matchId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 500, margin: '0 auto', padding: '24px 16px 80px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 22, color: 'var(--text)', marginBottom: 4,
        }}>
          Share Match Result
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
          {match.homeTeam.name} {match.homeScore}–{match.awayScore} {match.awayTeam.name}
        </p>

        {/* Canvas preview */}
        <div style={{
          border: '1px solid var(--border)', borderRadius: 14,
          overflow: 'hidden', marginBottom: 14,
          background: '#000', maxHeight: 500,
          display: 'flex', alignItems: 'center',
        }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', maxHeight: 500, objectFit: 'contain', display: 'block' }}
          />
        </div>

        {!flagsLoaded && (
          <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginBottom: 10 }}>
            Loading flag images...
          </p>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={download} style={{
            flex: 1, background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
          }}>
            {downloaded ? '✓ Downloaded!' : '↓ Download 9:16'}
          </button>
          <a href={`/live/${matchId}`} style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 12,
            padding: '13px', fontSize: 14, color: 'var(--text-2)',
            textDecoration: 'none', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            Live room →
          </a>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
