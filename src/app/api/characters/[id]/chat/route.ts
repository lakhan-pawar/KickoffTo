import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { NextRequest } from 'next/server'
import { agentChatLimiter } from '@/lib/redis'
import { CHARACTER_MAP } from '@/lib/constants'
import { buildCharacterSystemPrompt } from '@/lib/groq'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const character = CHARACTER_MAP.get(id)
  if (!character) {
    return new Response('Character not found', { status: 404 })
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await agentChatLimiter.limit(`chat:${ip}`)
  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Too many messages. Wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { messages } = await request.json()

  const keys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
  ].filter(Boolean) as string[]

  const apiKey = keys[Math.floor(Date.now() / 60000) % keys.length]
  const groq = createGroq({ apiKey })

  try {
    const result = streamText({
      model: groq(character.model) as any,
      system: buildCharacterSystemPrompt(character),
      messages,
      maxTokens: 300,
      temperature: 0.8,
    })
    return result.toDataStreamResponse()
  } catch {
    const mockMap: Record<string, string> = {
      'el-maestro': 'The pressing structure tells the whole story. Ask me again in a moment.',
      'xg-oracle': 'The xG model is temporarily recalibrating. Stand by.',
      'the-voice': 'I am momentarily speechless. The commentary resumes shortly.',
      'ultra': 'Servers getting ROBBED right now. Back in a moment.',
      'aria-9': 'Processing capacity exceeded, Operator. Stand by.',
      'coach-believe': 'Even servers need to believe sometimes! Try again!',
    }
    return new Response(
      mockMap[id] ?? `${character.name} is briefly unavailable. Please try again.`,
      { headers: { 'Content-Type': 'text/plain' } }
    )
  }
}
