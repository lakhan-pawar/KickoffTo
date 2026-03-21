'use client'

interface TickerProps {
  segments: string[]
}

export function Ticker({ segments }: TickerProps) {
  const doubled = [...segments, ...segments]

  return (
    <div style={{
      height: 32, overflow: 'hidden', display: 'flex', alignItems: 'center',
      background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)',
    }}
    onMouseEnter={e => {
      const inner = e.currentTarget.querySelector('.ticker-inner') as HTMLElement
      if (inner) inner.style.animationPlayState = 'paused'
    }}
    onMouseLeave={e => {
      const inner = e.currentTarget.querySelector('.ticker-inner') as HTMLElement
      if (inner) inner.style.animationPlayState = 'running'
    }}>
      <div className="ticker-inner animate-ticker" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {doubled.map((seg, i) => (
          <span key={i} style={{
            padding: '0 24px', fontSize: 11, color: 'var(--text-3)',
          }}>
            {seg}
          </span>
        ))}
      </div>
    </div>
  )
}
