import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildEvaluationPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData, PackingEvaluation } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { answers, weather, packedItems } = body as {
    answers: QuizAnswers
    weather: WeatherData | null
    packedItems: string[]
  }

  if (!answers || !Array.isArray(packedItems)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = buildEvaluationPrompt(answers, weather, packedItems)
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const json = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim()

    const evaluation: PackingEvaluation = JSON.parse(json)
    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Evaluation API error:', error)
    return NextResponse.json({ error: 'Failed to evaluate packing list' }, { status: 500 })
  }
}
