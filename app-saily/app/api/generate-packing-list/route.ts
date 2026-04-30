import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData, PackingList } from '@/lib/types'

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
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = buildGeminiPrompt(answers, weather)
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

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
