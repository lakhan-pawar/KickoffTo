'use client'
import { useState, useEffect } from 'react'

interface SocialPost {
  id: string
  text: string
  author: string
  created: string
  source: 'bluesky' | 'reddit' | 'news'
  url: string
  score?: number
}

interface PulseData {
  posts: SocialPost[]
  sentiment: { hype: number; debate: number; drama: number }
  summary: string
  updatedAt: string
}

const SOURCE_COLORS = {
  bluesky: '#0085ff',
  reddit:  '#ff4500',
  news:    '#16a34a',
}

const SOURCE_LABELS = {
  bluesky: 'Bluesky',
  reddit:  'Reddit',
  news:    'News',
}

export function PulseWidget() {
  const [data, setData] = useState<PulseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'bluesky' | 'reddit' | 'news'>('all')

  useEffect(() => {
    fetchPulse()
    // Refresh every 5 minutes
    const interval = setInterval(fetchPulse, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function fetchPulse() {
    try {
      setLoading(true)
      const res = await fetch('/api/pulse/social')
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Could not load social feed. Try refreshing.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = data?.posts.filter(p =>
    activeFilter === 'all' || p.source === activeFilter
  ) ?? []

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end',
          height: 28, justifyContent: 'center', marginBottom: 12 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: 4, borderRadius: 2, background: 'var(--green)',
              animation: `eqBar 0.7s ease-in-out ${i * 0.1}s infinite alternate`,
            }} />
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
          Loading social pulse...
        </p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>{error}</p>
        <button onClick={fetchPulse} style={{
          background: 'var(--green)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 16px', fontSize: 12,
          fontWeight: 600, cursor: 'pointer',
        }}>
          Try again
        </button>
      </div>
    )
  }

  const total = data.sentiment.hype + data.sentiment.debate + data.sentiment.drama || 1

  return (
    <div>
      {/* AI Summary */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 16, marginBottom: 16,
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
        }}>
          AI summary · right now
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
          {data.summary}
        </p>
        <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8 }}>
          Updated {new Date(data.updatedAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Sentiment meter */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 16, marginBottom: 16,
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
        }}>
          Fan sentiment
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { key: 'hype',   emoji: '🔥', label: 'Hype',   color: 'var(--green)',      val: data.sentiment.hype },
            { key: 'debate', emoji: '💬', label: 'Debate', color: 'var(--yellow-card)', val: data.sentiment.debate },
            { key: 'drama',  emoji: '😱', label: 'Drama',  color: 'var(--red-card)',    val: data.sentiment.drama },
          ].map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, width: 20, flexShrink: 0 }}>{s.emoji}</span>
              <span style={{ fontSize: 11, color: 'var(--text-2)', width: 48, flexShrink: 0 }}>
                {s.label}
              </span>
              <div style={{
                flex: 1, height: 6, background: 'var(--bg-elevated)',
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: s.color,
                  width: `${Math.round((s.val / total) * 100)}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <span style={{
                fontSize: 11, color: 'var(--text-3)',
                width: 32, textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {Math.round((s.val / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Source filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {(['all', 'bluesky', 'reddit', 'news'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 11,
              fontWeight: 500, cursor: 'pointer',
              background: activeFilter === f ? 'var(--green-tint)' : 'transparent',
              border: `1px solid ${activeFilter === f ? 'var(--green)' : 'var(--border)'}`,
              color: activeFilter === f ? 'var(--green)' : 'var(--text-2)',
            }}
          >
            {f === 'all' ? `All (${data.posts.length})` : SOURCE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Posts feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center',
            padding: '20px 0' }}>
            No posts from this source right now.
          </p>
        ) : (
          filtered.map(post => (
            <a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 14,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  SOURCE_COLORS[post.source]
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 6px',
                    borderRadius: 99, color: '#fff',
                    background: SOURCE_COLORS[post.source],
                  }}>
                    {SOURCE_LABELS[post.source]}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {post.author}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>
                    {new Date(post.created).toLocaleTimeString([], {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <p style={{
                  fontSize: 12, color: 'var(--text)', lineHeight: 1.5,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical' as any,
                  overflow: 'hidden',
                }}>
                  {post.text}
                </p>
                {post.score !== undefined && post.score > 0 && (
                  <div style={{
                    fontSize: 10, color: 'var(--text-3)', marginTop: 6,
                  }}>
                    ↑ {post.score.toLocaleString()} upvotes
                  </div>
                )}
              </div>
            </a>
          ))
        )}
      </div>

      <p style={{
        fontSize: 10, color: 'var(--text-3)', textAlign: 'center',
        marginTop: 16,
      }}>
        Refreshes every 5 minutes · Sources: Bluesky · Reddit · News
      </p>
    </div>
  )
}
