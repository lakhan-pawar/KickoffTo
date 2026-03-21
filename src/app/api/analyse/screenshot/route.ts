import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Use Gemini 2.5 Flash for vision analysis
    const geminiKey = process.env.GEMINI_API_KEY_1
      ?? process.env.GEMINI_API_KEY_2
      ?? process.env.GEMINI_API_KEY_3

    if (!geminiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: mimeType ?? 'image/jpeg',
                  data: image,
                },
              },
              {
                text: `You are El Maestro, a football tactical analyst at WC2026.
Analyse this football/soccer match screenshot.

Provide:
1. The likely formation of each team visible (e.g. 4-3-3, 4-4-2)
2. What tactical situation is unfolding (attack, defence, pressing, etc.)
3. Any notable positioning — a player out of position, a pressing trigger, a dangerous space

Style: precise, specific, tactical. 3-4 sentences maximum.
If this is not a football/soccer image, say so clearly.`,
              },
            ],
          }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.4,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message ?? `Gemini error ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (!text) {
      throw new Error('Empty response from Gemini')
    }

    // Try to extract formation from response
    const formationMatch = text.match(/(\d-\d-\d(?:-\d)?)/)?.[1]

    // Extract key observation (last sentence often has it)
    const sentences = text.split(/[.!?]+/).filter(Boolean)
    const keyObservation = sentences.length > 2
      ? sentences[sentences.length - 1].trim()
      : undefined

    return NextResponse.json({
      analysis: text.trim(),
      formation: formationMatch ?? null,
      keyObservation,
      generatedAt: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
