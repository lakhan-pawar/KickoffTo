'use client'
import { useEffect, useState } from 'react'

interface ChapterData {
  chapter: number
  title: string
  date: string
  content: string
  matchResults: string[]
  generatedAt: string
}

interface StoryChapterProps {
  chapter: ChapterData
  totalChapters: number
}

export function StoryChapter({ chapter, totalChapters }: StoryChapterProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setProgress(Math.min(100, Math.round(pct)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const wordCount = chapter.content.split(/\s+/).length
  const readingMins = Math.max(1, Math.round(wordCount / 200))
  const paragraphs = chapter.content.split('\n\n').filter(Boolean)

  return (
    <article>
      {/* Reading progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, zIndex: 200, background: 'var(--border)',
      }}>
        <div style={{
          height: '100%', background: 'var(--green)',
          width: `${progress}%`, transition: 'width 0.1s linear',
        }} />
      </div>

      {/* Chapter header */}
      <div style={{ padding: '32px 0 0' }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: 'var(--green)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
        }}>
          Chapter {chapter.chapter} of {totalChapters} · {chapter.date}
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(22px, 4vw, 36px)',
          letterSpacing: -0.5, color: 'var(--text)',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          {chapter.title}
        </h1>

        {/* Meta row */}
        <div style={{
          display: 'flex', gap: 16, alignItems: 'center',
          fontSize: 11, color: 'var(--text-3)', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, background: '#1a3a1a',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 9, color: 'rgba(255,255,255,0.85)',
            }}>
              AR
            </div>
            The Archive
          </div>
          <span>·</span>
          <span>{readingMins} min read</span>
          <span>·</span>
          <span>{wordCount} words</span>
        </div>

        {/* Match results that generated this chapter */}
        {chapter.matchResults.length > 0 && (
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 24,
          }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Based on these results
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {chapter.matchResults.map(result => (
                <span key={result} style={{
                  fontSize: 11, color: 'var(--text-2)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 6, padding: '3px 8px',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {result}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />
      </div>

      {/* Chapter body — book layout */}
      <div style={{
        maxWidth: '65ch',
        fontSize: 16,
        lineHeight: 1.75,
        color: 'var(--text-2)',
      }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{
            marginBottom: '1.4em',
          }}
          className={i === 0 ? 'story-drop-cap' : ''}>
            {para}
          </p>
        ))}
      </div>
    </article>
  )
}
