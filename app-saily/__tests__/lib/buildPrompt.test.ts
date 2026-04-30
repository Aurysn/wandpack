import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData } from '@/lib/types'

const answers: QuizAnswers = {
  destination: 'Tokyo',
  days: 7,
  baggage: 'checked',
  tripType: 'city',
  packingStyle: 'light',
  tempPreference: 'normal',
}

const weather: WeatherData = {
  city: 'Tokyo',
  temperature: 18,
  description: 'light rain',
}

describe('buildGeminiPrompt', () => {
  it('includes all quiz fields in the prompt', () => {
    const prompt = buildGeminiPrompt(answers, weather)
    expect(prompt).toContain('Tokyo')
    expect(prompt).toContain('7 days')
    expect(prompt).toContain('18°C')
    expect(prompt).toContain('light rain')
    expect(prompt).toContain('checked')
    expect(prompt).toContain('city')
    expect(prompt).toContain('light')
    expect(prompt).toContain('normal')
  })

  it('handles missing weather gracefully', () => {
    const prompt = buildGeminiPrompt(answers, null)
    expect(prompt).toContain('Tokyo')
    expect(prompt).toContain('weather data unavailable')
  })
})
