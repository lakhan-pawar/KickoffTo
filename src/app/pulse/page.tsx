// src/app/pulse/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'

interface PulseData {
  posts: Array<{
    id: string
    text: string
    author: string
    source: 'news' | 'reddit' | 'bluesky'
    url: string
    created: string
  }>
  counts: { news: number; reddit: number; bluesky: number; total: number }
  sentiment: { hype: number; debate: number; drama: number }
  summary: string
  cached: boolean
  error?: string
  updatedAt: string
}

const SOURCE_CONFIG = {
  reddit:  { label: 'Reddit',  icon: '⚽', color: '#ff4500' },
  news:    { label: 'News',    icon: '📰', color: '#3b82f6' },
  bluesky: { label: 'Bluesky', icon: '🦋', color: '#0085ff' },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

export default function PulsePage() {
  const [data, setData]       = useState<PulseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all' | 'reddit' | 'news' | 'bluesky'>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/pulse/social')
        if (!res.ok) throw new Error(`${res.status}`)
        setData(await res.json())
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
    const iv = setInterval(load, 300000)
    return () => clearInterval(iv)
  }, [])

  const filtered = data?.posts.filter(p =>
    filter === 'all' || p.source === filter
  ) ?? []

  return (
    <>
      <Navbar />
      <Ticker segments={[
        '🌐 Internet Pulse · WC2026 · Live',
        'News · Reddit · Bluesky · updated every 5 minutes',
      ]} />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 14px 80px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 28, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 6,
        }}>
          INTERNET PULSE
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
          What the world is saying about WC2026 right now.
        </p>

        {/* Sentiment + source counts */}
        {data && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap: 8, marginBottom: 16,
            }}>
              {[
                { 
                  icon: '⚽', 
                  value: String(data.counts.reddit), 
                  label: 'Reddit posts', 
                  sublabel: 'r/worldcup · r/soccer',
                  color: '#ff4500' 
                },
                { 
                  icon: '📰', 
                  value: String(data.counts.news), 
                  label: 'News articles', 
                  sublabel: 'football-specific',
                  color: '#3b82f6' 
                },
                { 
                  icon: '🔥', 
                  value: String(data.sentiment.hype), 
                  label: 'Hype posts', 
                  sublabel: 'positive sentiment',
                  color: '#f59e0b' 
                },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${s.color}33`,
                  borderRadius: 12, padding: '12px 10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24, fontWeight: 900,
                    color: s.color, marginBottom: 3,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', opacity: 0.7 }}>{s.sublabel}</div>
                </div>
              ))}
            </div>

            {/* AI summary */}
            {data.summary && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderLeft: '3px solid #16a34a',
                borderRadius: '0 12px 12px 0',
                padding: '12px 16px', marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: 'var(--green)',
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
                }}>
                  🤖 AI summary
                </div>
                <p style={{
                  fontSize: 13, color: 'var(--text-2)',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {data.summary}
                </p>
              </div>
            )}
          </>
        )}

        {/* Source filter tabs */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap',
        }}>
          {(['all', 'reddit', 'news', 'bluesky'] as const).map(src => {
            const count = src === 'all'
              ? data?.counts.total
              : data?.counts[src as keyof typeof data.counts]
            const cfg = src === 'all'
              ? { icon: '🌐', label: 'All', color: 'var(--green)' }
              : SOURCE_CONFIG[src as keyof typeof SOURCE_CONFIG]
            return (
              <button key={src} onClick={() => setFilter(src)} style={{
                background: filter === src ? 'var(--bg-elevated)' : 'var(--bg-card)',
                border: `1px solid ${filter === src ? cfg.color : 'var(--border)'}`,
                borderRadius: 99, padding: '5px 12px',
                fontSize: 11, fontWeight: 600,
                color: filter === src ? cfg.color : 'var(--text-3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {cfg.icon} {cfg.label}
                {count !== undefined && (
                  <span style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 99, padding: '1px 6px',
                    fontSize: 10,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
          {data && (
            <span style={{
              fontSize: 10, color: 'var(--text-3)',
              marginLeft: 'auto', alignSelf: 'center',
            }}>
              {data.cached ? '🟡 Cached' : '🟢 Live'} ·{' '}
              {timeAgo(data.updatedAt)}
            </span>
          )}
        </div>

        {/* Posts list */}
        {loading ? (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12, padding: 16,
                height: 80, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s linear infinite',
                }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            color: 'var(--text-3)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌐</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>
              {data?.error
                ? 'Could not reach social feeds'
                : data?.counts.total === 0
                ? 'No WC2026 posts found yet'
                : 'No posts for this filter'}
            </div>
            <div style={{ fontSize: 12 }}>
              {data?.error
                ? `Error: ${data.error}`
                : 'WC2026 discussion picks up closer to June 11'}
            </div>
            {data?.error && (
              <div style={{
                marginTop: 12, fontSize: 11,
                color: '#ef4444', fontFamily: 'monospace',
              }}>
                {data.error}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(post => {
              const cfg = SOURCE_CONFIG[post.source as keyof typeof SOURCE_CONFIG]
              return (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12, padding: '12px 14px',
                    transition: 'border-color 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = cfg.color + '66'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'var(--border)'
                    el.style.transform = 'none'
                  }}>
                    {/* Source + author + time */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 8, marginBottom: 8,
                    }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: cfg.color,
                        background: cfg.color + '18',
                        borderRadius: 5, padding: '2px 7px',
                        border: `1px solid ${cfg.color}33`,
                      }}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {post.author}
                      </span>
                      <span style={{
                        fontSize: 10, color: 'var(--text-3)',
                        marginLeft: 'auto',
                      }}>
                        {timeAgo(post.created)}
                      </span>
                    </div>

                    {/* Post text */}
                    <p style={{
                      fontSize: 13, color: 'var(--text)',
                      lineHeight: 1.55, margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.text}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
