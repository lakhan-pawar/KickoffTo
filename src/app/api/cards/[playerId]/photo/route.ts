import { NextRequest, NextResponse } from 'next/server'
import { getPlayerPhotos } from '@/lib/thesportsdb'

export const runtime = 'edge'

const PLAYER_NAMES: Record<string, string> = {
  'messi': 'Lionel Messi',
  'mbappe': 'Kylian Mbappé',
  'davies': 'Alphonso Davies',
  'vinicius': 'Vinicius Junior',
  'bellingham': 'Jude Bellingham',
  'yamal': 'Lamine Yamal',
  'ronaldo': 'Cristiano Ronaldo',
  'neymar': 'Neymar',
  'wirtz': 'Florian Wirtz',
  'pulisic': 'Christian Pulisic',
  'hakimi': 'Achraf Hakimi',
  'salah': 'Mohamed Salah',
  'haaland': 'Erling Haaland',
  'kane': 'Harry Kane',
  'osimhen': 'Victor Osimhen',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params
  const decodedId = decodeURIComponent(playerId)
  
  // Try mapping first, then fallback to cleaned ID
  let playerName = PLAYER_NAMES[decodedId.toLowerCase()]
  if (!playerName) {
    playerName = decodedId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const photos = await getPlayerPhotos(playerName)
  return NextResponse.json(photos)
}
