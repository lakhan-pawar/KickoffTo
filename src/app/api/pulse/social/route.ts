import { NextResponse } from 'next/server'
import { getCache, setCache } from '@/lib/redis'
import { getSocialPosts } from '@/lib/social'
import { groqChat } from '@/lib/groq'

export const runtime = 'edge'

export async function GET() {
  const cacheKey = 'social:pulse'
  const cached = await getCache(cacheKey)
  if (cached) return NextResponse.json(cached)

  try {
    const posts = await getSocialPosts('#WC2026')

    // Simple sentiment scoring based on keywords
    let hype = 0, debate = 0, drama = 0
    posts.forEach(post => {
      const t = post.text.toLowerCase()
      if (t.match(/amazing|incredible|brilliant|goal|scored|won|yes|legend|class/))
        hype++
      if (t.match(/wrong|disagree|actually|but|think|should|would|could|bad|awful/))
        debate++
      if (t.match(/shocking|unbelievable|no way|scandal|penalty|var|robbery|robbed|upset/))
        drama++
    })

    // AI summary of top posts
    let summary = `Football fans are discussing WC2026 across social media right now.`
    if (posts.length > 0) {
      try {
        const topTexts = posts.slice(0, 5).map(p => p.text).join(' | ')
        summary = await groqChat(
          [{
            role: 'user',
            content: `Summarise what football fans are saying in exactly 2 sentences.
Posts: "${topTexts}"
Be specific. Mention any teams or players discussed. 2 sentences only.`,
          }],
          'llama-3.1-8b-instant',
          100,
        )
      } catch {}
    }

    const result = {
      posts: posts.slice(0, 20),
      sentiment: {
        hype: Math.max(hype, 1),
        debate: Math.max(debate, 1),
        drama: Math.max(drama, 1),
      },
      summary: summary.trim(),
      updatedAt: new Date().toISOString(),
    }

    // Cache 5 minutes
    await setCache(cacheKey, result, 300)
    return NextResponse.json(result)
  } catch {
    // Return mock data so the page doesn't break
    return NextResponse.json({
      posts: [
        {
          id: 'mock-1',
          text: 'WC2026 is going to be absolutely incredible. 48 teams, three nations, one trophy.',
          author: 'kickoffto',
          created: new Date().toISOString(),
          source: 'bluesky',
          url: 'https://bsky.app',
        },
        {
          id: 'mock-2',
          text: 'Canada hosting their first World Cup since 1986. This is going to be something special.',
          author: 'canadasoccer_fan',
          created: new Date().toISOString(),
          source: 'reddit',
          url: 'https://reddit.com/r/CanadaSoccer',
          score: 2847,
        },
      ],
      sentiment: { hype: 8, debate: 3, drama: 2 },
      summary: 'Football fans are buzzing with excitement about WC2026. Canada\'s home tournament is generating significant discussion across social media.',
      updatedAt: new Date().toISOString(),
    })
  }
}
