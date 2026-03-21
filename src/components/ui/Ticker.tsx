// src/components/ui/Ticker.tsx
'use client'
import { useEffect, useRef } from 'react'

export function Ticker({ segments }: { segments: string[] }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const posRef   = useRef(0)
  const rafRef   = useRef(0)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const id = setTimeout(() => {
      const half = el.scrollWidth / 2
      function tick() {
        posRef.current -= 0.55
        if (el && Math.abs(posRef.current) >= half) posRef.current = 0
        if (el) el.style.transform = `translateX(${posRef.current}px)`
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, 120)
    return () => { clearTimeout(id); cancelAnimationFrame(rafRef.current) }
  }, [segments])

  const doubled = [...segments, ...segments]

  return (
    <div style={{
      overflow:'hidden', background:'var(--bg-elevated)',
      borderBottom:'1px solid var(--border)',
      height:30, display:'flex', alignItems:'center',
    }}>
      <div ref={innerRef} style={{
        display:'inline-flex', alignItems:'center',
        willChange:'transform', whiteSpace:'nowrap',
      }}>
        {doubled.map((seg, i) => (
          <span key={i} style={{
            display:'inline-block', fontSize:11,
            color:'var(--text-3)', padding:'0 28px',
            borderRight:'1px solid var(--border)',
          }}>
            {seg}
          </span>
        ))}
      </div>
    </div>
  )
}
