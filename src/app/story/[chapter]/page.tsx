import { notFound } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { StoryChapter } from '@/components/story/StoryChapter'
import { getCache } from '@/lib/redis'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ chapter: string }>
}

interface ChapterData {
  chapter: number
  title: string
  date: string
  content: string
  matchResults: string[]
  generatedAt: string
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter } = await params
  const num = parseInt(chapter)
  if (isNaN(num)) return { title: 'Story — KickoffTo' }
  return {
    title: `Chapter ${num} — KickoffTo Story Mode`,
    description: `WC2026 Story Mode — Chapter ${num}. Narrated by The Archive.`,
  }
}

// Mock chapter for development — replace with real Redis data in production
function getMockChapter(num: number): ChapterData {
  return {
    chapter: num,
    title: 'The Night Messi Silenced New Jersey',
    date: 'June 14, 2026',
    content: `The 67th minute arrived like all great football moments do — slowly at first, then all at once. Argentina had controlled possession for long stretches but France, as France always does, had remained patient and dangerous in equal measure.

Then Enzo played the pass. In fourteen years of watching football, there are perhaps a handful of moments where a single action crystallises everything that makes the sport beautiful. This was one of them.

The crowd at MetLife had been holding its breath collectively for ninety seconds — that particular breed of silence that only football stadiums produce, when 80,000 people simultaneously understand that something important is about to happen before it has happened.

Messi received the ball in the channel. His first touch killed it completely. His second sent the goalkeeper the wrong way. His third found the net.

What followed was not silence but its opposite — a sound that began somewhere near the south stand and moved outward like a wave, growing as it went, until the entire stadium was caught inside it. Argentina 2, France 1. Sixty-seven minutes played. Twenty-three to go.

The Archive notes this for posterity: on a warm June evening in New Jersey, the most gifted footballer who ever lived reminded sixty thousand people why they fell in love with this game in the first place. Some things, it turns out, do not diminish with time.`,
    matchResults: ['Argentina 2–1 France', 'Brazil 3–0 Canada'],
    generatedAt: new Date().toISOString(),
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter: chapterParam } = await params
  const num = parseInt(chapterParam)
  if (isNaN(num) || num < 1 || num > 64) notFound()

  let chapter: ChapterData | null = null
  try {
    chapter = await getCache<ChapterData>(`story:chapter:${num}`)
  } catch {}

  // Use mock for development
  if (!chapter) {
    chapter = getMockChapter(num)
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 100px' }}>
        <StoryChapter chapter={chapter} totalChapters={64} />

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 40,
          paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {num > 1 && (
            <Link href={`/story/${num - 1}`} style={{
              flex: 1, background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '12px 16px', textDecoration: 'none',
              fontSize: 13, color: 'var(--text-2)',
            }}>
              ← Chapter {num - 1}
            </Link>
          )}
          <Link href="/story" style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '12px 16px', textDecoration: 'none',
            fontSize: 13, color: 'var(--text-2)', textAlign: 'center',
          }}>
            All chapters
          </Link>
          {num < 64 && (
            <Link href={`/story/${num + 1}`} style={{
              flex: 1, background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '12px 16px', textDecoration: 'none',
              fontSize: 13, color: 'var(--text-2)', textAlign: 'right',
            }}>
              Chapter {num + 1} →
            </Link>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
