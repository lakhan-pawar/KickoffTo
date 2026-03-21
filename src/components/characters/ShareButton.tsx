'use client'
import { useState } from 'react'

export function ShareButton({ characterId }: { characterId: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/characters/${characterId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <button onClick={handleShare} style={{
      width: '100%', padding: '8px 12px', borderRadius: 8,
      border: `1px solid ${copied ? 'var(--green)' : 'var(--border)'}`,
      background: 'var(--bg-elevated)',
      color: copied ? 'var(--green)' : 'var(--text-3)',
      fontSize: 12, fontWeight: 500, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      transition: 'color 0.2s, border-color 0.2s',
    }}>
      {copied ? '✓ Link copied!' : '🔗 Share this character'}
    </button>
  )
}
