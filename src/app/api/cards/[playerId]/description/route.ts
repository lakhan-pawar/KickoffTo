import { NextRequest, NextResponse } from 'next/server'
import { groqChat } from '@/lib/groq'
import { getCache, setCache, CACHE_KEYS } from '@/lib/redis'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params

  // Check permanent cache first
  const cacheKey = CACHE_KEYS.cardDescription(playerId)
  const cached = await getCache<{ description: string }>(cacheKey)
  if (cached) return NextResponse.json(cached)

  const playerNames: Record<string, string> = {
    'messi': 'Lionel Messi (Argentina)',
    'mbappe': 'Kylian Mbappé (France)',
    'davies': 'Alphonso Davies (Canada)',
  }

  const playerName = playerNames[playerId] ?? playerId

  try {
    const description = await groqChat(
      [{
        role: 'user',
        content: `Write exactly 2 sentences for a WC2026 trading card description for ${playerName}.
Style: literary, evocative, like a Panini card back written by a great sportswriter.
Reference their WC2026 performance specifically.
2 sentences only. No quotes around the output.`,
      }],
      'llama-3.1-8b-instant',
      80,
    )

    const result = { description: description.trim() }
    // Cache permanently
    await setCache(cacheKey, result)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({
      description: `A generational talent performing on the world's biggest stage at WC2026. Every touch carries the weight of a nation's hopes.`,
    })
  }
}
