import { NextRequest, NextResponse } from 'next/server'
import { groqChat } from '@/lib/groq'
import { getCache, setCache } from '@/lib/redis'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  // Verify this is a legitimate cron call or admin request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow unauthenticated in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const { chapterNumber, matchResults, date } = await request.json()

    // Check if already generated
    const existing = await getCache(`story:chapter:${chapterNumber}`)
    if (existing) {
      return NextResponse.json({ cached: true, chapter: existing })
    }

    const matchSummary = Array.isArray(matchResults)
      ? matchResults.join(', ')
      : matchResults

    const prompt = `You are The Archive — a football historian narrating the WC2026 story.

Today's match results: ${matchSummary}
This is Chapter ${chapterNumber} of the WC2026 novel.
Date: ${date}

Write a literary 4-5 paragraph narrative chapter about today's matches.
Style: Ken Burns documentary meets sports journalism. Warm, vivid, historical perspective.
Connect today's results to WC history where relevant.
Do NOT use bullet points. Write flowing prose paragraphs only.
End with one sentence connecting today to what comes next.
400-600 words maximum.`

    const content = await groqChat(
      [{ role: 'user', content: prompt }],
      'llama-3.3-70b-versatile',
      800,
    )

    // Generate a title from the content
    const titlePrompt = `Based on this chapter content, generate a dramatic 4-6 word title:
"${content.slice(0, 200)}"
Return ONLY the title, nothing else.`

    const title = await groqChat(
      [{ role: 'user', content: titlePrompt }],
      'llama-3.1-8b-instant',
      30,
    )

    const chapter = {
      chapter: chapterNumber,
      title: title.trim().replace(/['"]/g, ''),
      date,
      content: content.trim(),
      matchResults: Array.isArray(matchResults) ? matchResults : [matchResults],
      generatedAt: new Date().toISOString(),
    }

    // Cache permanently
    await setCache(`story:chapter:${chapterNumber}`, chapter)

    // Update chapters index
    const index = await getCache<any[]>('story:chapters-index') ?? []
    const updatedIndex = [
      ...index.filter((c: any) => c.chapter !== chapterNumber),
      {
        chapter: chapterNumber,
        title: chapter.title,
        date,
        preview: content.slice(0, 120).trim() + '...',
      },
    ].sort((a, b) => b.chapter - a.chapter)
    await setCache('story:chapters-index', updatedIndex)

    return NextResponse.json({ success: true, chapter })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
