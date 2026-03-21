// src/app/api/pulse/social/route.ts
import { NextResponse } from 'next/server'
import { getCache, setCache } from '@/lib/redis'
import { getSocialPosts } from '@/lib/social'
import { groqChat } from '@/lib/groq'

export const runtime = 'edge'

export async function GET() {
  const cacheKey = 'social:pulse:v2'

  // Check cache (5 minute TTL)
  try {
    const cached = await getCache(cacheKey)
    if (cached) return NextResponse.json({ ...cached, cached: true })
  } catch {}

  try {
    const posts = await getSocialPosts('World Cup 2026')

    // Count by source
    const counts = {
      news:    posts.filter(p => p.source === 'news').length,
      reddit:  posts.filter(p => p.source === 'reddit').length,
      bluesky: posts.filter(p => p.source === 'bluesky').length,
      total:   posts.length,
    }

    // Sentiment scoring
    let hype = 0, debate = 0, drama = 0
    posts.forEach(post => {
      const t = post.text.toLowerCase()
      if (t.match(/amazing|incredible|brilliant|goal|scored|won|legend|class|great|best/))
        hype++
      if (t.match(/wrong|disagree|actually|but|think|should|would|could|bad|awful|boring/))
        debate++
      if (t.match(/shocking|unbelievable|scandal|penalty|var|robbery|robbed|upset|controversy/))
        drama++
    })

    // AI summary
    let summary = 'WC2026 is generating buzz across news and social media.'
    if (posts.length > 0) {
      try {
        const topTexts = posts
          .slice(0, 6)
          .map(p => p.text.slice(0, 120))
          .join(' | ')

        summary = await groqChat(
          [{
            role: 'user',
            content: `Summarise what people are saying about WC2026 in exactly 2 sentences.
Content: "${topTexts}"
Be specific. Mention teams, players or topics. 2 sentences only. No preamble.`,
          }],
          'llama-3.1-8b-instant',
          120,
        )
      } catch {}
    }

    const result = {
      posts: posts.slice(0, 20),
      counts,
      sentiment: {
        hype: Math.max(hype, 1),
        debate: Math.max(debate, 1),
        drama: Math.max(drama, 1),
      },
      summary: summary.trim(),
      cached: false,
      updatedAt: new Date().toISOString(),
    }

    // Cache 5 minutes
    try {
      await setCache(cacheKey, result, 300)
    } catch {}

    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'

    // Return meaningful fallback so UI doesn't hang
    return NextResponse.json({
      posts: [],
      counts: { news: 0, reddit: 0, bluesky: 0, total: 0 },
      sentiment: { hype: 0, debate: 0, drama: 0 },
      summary: 'WC2026 starts June 11. Social data will update once the tournament begins.',
      cached: false,
      error: msg,
      updatedAt: new Date().toISOString(),
    })
  }
}
