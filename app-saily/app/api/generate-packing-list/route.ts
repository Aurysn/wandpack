import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData, PackingList } from '@/lib/types'

async function generateWithRetry(
  apiKey: string,
  prompt: string,
  maxAttempts = 4
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (err: unknown) {
      const is503 =
        err instanceof Error &&
        (err.message.includes('503') || err.message.includes('Service Unavailable'))
      if (is503 && attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 1000 * attempt))
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { answers, weather } = body as { answers: QuizAnswers; weather: WeatherData | null }

  if (!answers || typeof answers.destination !== 'string') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
  }

  try {
    const prompt = buildGeminiPrompt(answers, weather)
    const text = await generateWithRetry(apiKey, prompt)

    const json = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim()

    const packingList: PackingList = JSON.parse(json)
    return NextResponse.json(packingList)
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to generate packing list' }, { status: 500 })
  }
}
