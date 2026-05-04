import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData } from '@/lib/types'

const answers: QuizAnswers = {
  destination: 'Tokyo',
  days: 7,
  departureDate: '2026-06-01',
  baggage: 'checked',
  tripType: 'city',
  packingStyle: 'light',
  tempPreference: 'normal',
}

const weather: WeatherData = {
  city: 'Tokyo',
  country: 'JP',
  temperature: 18,
  tempMin: 14,
  tempMax: 22,
  description: 'light rain',
  isForecast: true,
  requestedDays: 7,
  dailyForecasts: [],
}

describe('buildGeminiPrompt', () => {
  it('includes all quiz fields in the prompt', () => {
    const prompt = buildGeminiPrompt(answers, weather)
    expect(prompt).toContain('Tokyo')
    expect(prompt).toContain('7 days')
    expect(prompt).toContain('14')
    expect(prompt).toContain('22')
    expect(prompt).toContain('light rain')
    expect(prompt).toContain('Checked')
    expect(prompt).toContain('City')
    expect(prompt).toContain('light')
    expect(prompt).toContain('normal')
  })

  it('handles missing weather gracefully', () => {
    const prompt = buildGeminiPrompt(answers, null)
    expect(prompt).toContain('Tokyo')
    expect(prompt).toContain('weather data unavailable')
  })
})
