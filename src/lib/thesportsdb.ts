import { getCache, setCache } from '@/lib/redis'

interface SportsDBPlayer {
  idPlayer: string
  strPlayer: string
  strThumb: string | null
  strCutout: string | null
  strNationality: string
  strPosition: string
  strTeam: string
  dateBorn: string
}

interface SportsDBResponse {
  player: SportsDBPlayer[] | null
}

export async function getPlayerPhotos(playerName: string): Promise<{
  cutout: string | null
  thumb: string | null
  position: string | null
}> {
  const cacheKey = `sportsdb:player:${playerName.toLowerCase().replace(/\s+/g, '-')}`

  try {
    const cached = await getCache<{ cutout: string | null; thumb: string | null; position: string | null }>(cacheKey)
    if (cached) return cached
  } catch {}

  try {
    const encoded = encodeURIComponent(playerName)
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encoded}`,
      {
        headers: { 'User-Agent': 'KickoffTo/1.0 (hello@kickoffto.com)' },
        next: { revalidate: 86400 * 7 }, // Cache 7 days at fetch level too
      }
    )

    if (!res.ok) throw new Error(`TheSportsDB error ${res.status}`)

    const data: SportsDBResponse = await res.json()
    const players = data.player

    if (!players || players.length === 0) {
      const empty = { cutout: null, thumb: null, position: null }
      await setCache(cacheKey, empty, 86400)
      return empty
    }

    // Pick best match — first result is usually most relevant
    const player = players[0]
    const result = {
      cutout: player.strCutout ?? null,
      thumb: player.strThumb ?? null,
      position: player.strPosition ?? null,
    }

    // Cache permanently — player photos don't change often
    await setCache(cacheKey, result)
    return result
  } catch {
    return { cutout: null, thumb: null, position: null }
  }
}

// Map TheSportsDB position strings to our 4-position system
export function normalisePosition(sportsdbPosition: string | null): 'GK' | 'DEF' | 'MID' | 'ATT' {
  if (!sportsdbPosition) return 'MID'
  const p = sportsdbPosition.toLowerCase()
  if (p.includes('goalkeeper') || p.includes('keeper')) return 'GK'
  if (p.includes('back') || p.includes('defender') || p.includes('centre-back')) return 'DEF'
  if (p.includes('forward') || p.includes('striker') || p.includes('winger') || p.includes('attacker')) return 'ATT'
  return 'MID'
}
