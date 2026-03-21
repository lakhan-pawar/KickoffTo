import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import { getCache } from '@/lib/redis'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Story Mode — KickoffTo',
  description: 'The WC2026 AI novel. A new chapter after every match day.',
}

export const revalidate = 3600

interface StoryChapter {
  chapter: number
  title: string
  date: string
  preview: string
}

export default async function StoryPage() {
  // Try to get existing chapters from Redis
  let chapters: StoryChapter[] = []
  try {
    const stored = await getCache<StoryChapter[]>('story:chapters-index')
    if (stored) chapters = stored
  } catch {}

  const tournamentStarted = new Date() >= new Date('2026-06-11T20:00:00Z')

  return (
    <>
      <Navbar />
      <Ticker segments={[
        '📖 WC2026 Story Mode · A new chapter every match day',
        'Written by The Archive · Powered by Groq',
        `${chapters.length > 0 ? `${chapters.length} chapters published` : 'Begins June 11, 2026'}`,
      ]} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: 'var(--green)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
          }}>
            The WC2026 Novel
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 48px)',
            letterSpacing: -1, color: 'var(--text)', marginBottom: 12,
            lineHeight: 1.05,
          }}>
            STORY MODE
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '55ch' }}>
            Every match day, The Archive narrates what happened. By July 19,
            this will be a 64-chapter novel of WC2026 — written in real time
            from real results.
          </p>
        </div>

        {/* Archive character card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid #1a3a1a',
          borderRadius: '0 12px 12px 0',
          padding: 16, marginBottom: 32,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#1a3a1a',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 13, color: 'rgba(255,255,255,0.85)', flexShrink: 0,
          }}>AR</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
              Narrated by The Archive
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Football Historian · generates each chapter from real match results
            </div>
          </div>
          <Link href="/characters/the-archive" style={{
            marginLeft: 'auto', fontSize: 11, color: 'var(--green)',
            textDecoration: 'none', flexShrink: 0,
          }}>
            Chat with The Archive →
          </Link>
        </div>

        {/* Chapters list or pre-tournament state */}
        {chapters.length > 0 ? (
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
            }}>
              {chapters.length} chapters published
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chapters.map(ch => (
                <Link key={ch.chapter} href={`/story/${ch.chapter}`}
                  style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: 16,
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1a3a1a' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)' }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5,
                    }}>
                      Chapter {ch.chapter} · {ch.date}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 16,
                      fontWeight: 700, color: 'var(--text)', marginBottom: 5,
                    }}>
                      {ch.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)',
                      lineHeight: 1.5, fontStyle: 'italic' }}>
                      {ch.preview}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Pre-tournament state
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
            }}>
              Coming June 11
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 16, opacity: 0.4,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
                    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                    Chapter {i + 1} · Match Day {i + 1}
                  </div>
                  <div style={{
                    height: 16, background: 'var(--bg-elevated)',
                    borderRadius: 4, width: `${60 + i * 8}%`, marginBottom: 8,
                  }} />
                  <div style={{
                    height: 12, background: 'var(--bg-elevated)',
                    borderRadius: 4, width: '90%',
                  }} />
                </div>
              ))}
              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center',
                marginTop: 8, fontStyle: 'italic' }}>
                Chapter 1 generates after the opening match on June 11
              </p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
