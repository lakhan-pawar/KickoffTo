// src/app/api/pulse/social/route.ts
import { NextResponse } from 'next/server'
import { getCache, setCache } from '@/lib/redis'
import { getSocialPosts } from '@/lib/social'
import { groqChat } from '@/lib/groq'

export const runtime = 'edge'

export async function GET() {
  const cacheKey = 'social:pulse:v3'

  try {
    const cached = await getCache(cacheKey)
    if (cached) return NextResponse.json({ ...cached, cached: true })
  } catch {}

  try {
    const posts = await getSocialPosts('#WC2026')

    const counts = {
      reddit:  posts.filter(p => p.source === 'reddit').length,
      news:    posts.filter(p => p.source === 'news').length,
      bluesky: posts.filter(p => p.source === 'bluesky').length,
      total:   posts.length,
    }

    // Sentiment
    let hype = 0, debate = 0, drama = 0
    posts.forEach(post => {
      const t = post.text.toLowerCase()
      if (t.match(/amazing|incredible|brilliant|goal|scored|won|legend|class|great|best|loved/))
        hype++
      if (t.match(/wrong|disagree|think|should|would|could|bad|awful|boring|overrated|poor/))
        debate++
      if (t.match(/shocking|unbelievable|scandal|penalty|var|robbery|robbed|upset|controversy|red card/))
        drama++
    })

    // AI summary
    let summary = 'WC2026 discussion is building across football communities.'
    if (posts.length > 0) {
      try {
        const topTexts = posts
          .slice(0, 6)
          .map(p => p.text.slice(0, 100))
          .join(' | ')

        summary = await groqChat(
          [{
            role: 'user',
            content: `Summarise what football fans are saying about WC2026 in exactly 2 sentences.
Posts: "${topTexts}"
Be specific about teams or players mentioned. 2 sentences only. No preamble.`,
          }],
          'llama-3.1-8b-instant',
          120,
        )
      } catch {}
    }

    const result = {
      posts: posts.slice(0, 25),
      counts,
      sentiment: {
        hype:   Math.max(hype, 0),
        debate: Math.max(debate, 0),
        drama:  Math.max(drama, 0),
      },
      summary: summary.trim(),
      cached: false,
      updatedAt: new Date().toISOString(),
    }

    try { await setCache(cacheKey, result, 300) } catch {}
    return NextResponse.json(result)

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown'
    return NextResponse.json({
      posts: [],
      counts: { reddit: 0, news: 0, bluesky: 0, total: 0 },
      sentiment: { hype: 0, debate: 0, drama: 0 },
      summary: 'Social data loading. Check back soon.',
      cached: false,
      error: msg,
      updatedAt: new Date().toISOString(),
    })
  }
}
