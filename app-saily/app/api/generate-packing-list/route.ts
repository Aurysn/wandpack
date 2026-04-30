import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData, PackingList } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { answers, weather }: { answers: QuizAnswers; weather: WeatherData | null } =
    await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = buildGeminiPrompt(answers, weather)
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const json = text.startsWith('```')
      ? text.replace(/```json\n?/, '').replace(/```$/, '').trim()
      : text

    const packingList: PackingList = JSON.parse(json)
    return NextResponse.json(packingList)
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to generate packing list' }, { status: 500 })
  }
}
