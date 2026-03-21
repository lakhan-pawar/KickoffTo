import { streamText, createDataStreamResponse, formatDataStreamPart } from 'ai'
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

  const mockMap: Record<string, string> = {
    'el-maestro': 'The tactical analysis is undergoing a brief correction. One moment.',
    'xg-oracle': 'The xG model is currently being retrained. Stand by.',
    'the-voice': 'A slight technical hitch in the booth. Back soon.',
    'ultra': 'Even the best firms have to regroup sometimes. Back in a bit.',
    'aria-9': 'Optimizing core-logic processing. Stand by, Operator.',
    'coach-believe': 'Just a little halftime adjustment! We’ll be right back!',
    'the-archive': 'The archives are currently being reorganized for better accuracy.',
  }

  if (keys.length === 0) {
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.write(formatDataStreamPart('text', mockMap[id] ?? `${character.name} is currently resting. Please try again later.`))
      },
    })
  }

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
  } catch (error) {
    console.error('Chat API Error:', error)
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.write(formatDataStreamPart('text', mockMap[id] ?? `${character.name} is briefly unavailable. Please try again.`))
      },
    })
  }
}
