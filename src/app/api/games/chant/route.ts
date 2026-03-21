import { NextRequest, NextResponse } from 'next/server'
import { groqChat } from '@/lib/groq'

export const runtime = 'edge'

const STYLE_PROMPTS: Record<string, string> = {
  terrace: `Write a classic football terrace chant for this team at WC2026.
Format: 4-8 lines, rhythmic, meant to be shouted in unison.
Include the team name. Make it catchy and repetitive.
No profanity. Family-friendly.`,
  melodic: `Write a melodic football chant for this team, sung to the tune of a famous song.
Mention which tune it's sung to in brackets at the top.
4-8 lines, melodic, meant to be sung.
No profanity. Family-friendly.`,
  sarcastic: `Write a sarcastic/mocking terrace chant aimed at the opposing fans (not a specific player).
4-6 lines, witty, meant to be amusing.
No profanity or personal attacks. Keep it football-banter level.`,
  epic: `Write an epic tournament anthem for this team at WC2026.
Something that sounds like it could open the World Cup.
6-10 lines, powerful, inspiring, cinematic.
No profanity. Family-friendly.`,
}

export async function POST(request: NextRequest) {
  try {
    const { team, style } = await request.json()

    const systemPrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.terrace
    const chant = await groqChat(
      [{
        role: 'user',
        content: `Team: ${team}\nWC2026 host cities: Mexico City, Toronto, New York, Los Angeles, Dallas\n\nWrite the chant now. Output ONLY the chant text itself, no introduction or explanation.`,
      }],
      'llama-3.1-8b-instant',
      200,
      systemPrompt,
    )

    return NextResponse.json({ chant: chant.trim(), team, style })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
