import type { QuizAnswers, WeatherData, DailyForecast } from './types'

const BAGGAGE_LABELS: Record<QuizAnswers['baggage'], string> = {
  hand: 'Hand luggage only',
  checked: 'Checked bag',
  both: 'Both hand luggage and checked bag',
}

const TRIP_LABELS: Record<QuizAnswers['tripType'], string> = {
  beach: 'Beach',
  city: 'City trip',
  business: 'Business',
  hiking: 'Hiking',
}

const PACKING_LABELS: Record<QuizAnswers['packingStyle'], string> = {
  light: 'Pack light (only the essentials)',
  heavy: 'Pack heavy (bring everything just in case)',
}

const TEMP_LABELS: Record<QuizAnswers['tempPreference'], string> = {
  cold: 'Runs cold',
  hot: 'Runs hot',
  normal: 'normal',
}

function buildWeatherNarrative(weather: WeatherData): string {
  const range = `temperatures ${weather.tempMin}–${weather.tempMax}°C`
  const forecasts: DailyForecast[] = weather.dailyForecasts

  if (forecasts.length === 0) return `${range}, ${weather.description}`
  if (forecasts.length === 1) return `${range}, ${forecasts[0].description}`

  const descriptions = forecasts.map((d) => d.description)
  const unique = Array.from(new Set(descriptions))
  if (unique.length === 1) return `${range}, ${unique[0]} throughout`

  const mid = Math.ceil(forecasts.length / 2)
  const firstDescs = Array.from(new Set(descriptions.slice(0, mid))).join(' and ')
  const laterDescs = Array.from(new Set(descriptions.slice(mid))).join(' and ')
  if (firstDescs === laterDescs) return `${range}, ${firstDescs}`
  return `${range}, ${firstDescs} for first ${mid} days then ${laterDescs}`
}

export function buildGeminiPrompt(
  answers: QuizAnswers,
  weather: WeatherData | null
): string {
  let weatherLine = 'weather data unavailable'
  if (weather) {
    weatherLine = `${answers.destination}, ${answers.days} days, ${buildWeatherNarrative(weather)}`
  }

  return `You are a smart travel packing assistant. Generate a packing list for the following trip:
- Destination: ${answers.destination}
- Departure date: ${answers.departureDate}
- Duration: ${answers.days} days
- Weather: ${weatherLine}
- Baggage: ${BAGGAGE_LABELS[answers.baggage]}
- Trip type: ${TRIP_LABELS[answers.tripType]}
- Packing style: ${PACKING_LABELS[answers.packingStyle]}
- Temperature preference: ${TEMP_LABELS[answers.tempPreference]}

Return a JSON object with this exact structure:
{
  "clothes": ["item1", "item2"],
  "toiletries": ["item1", "item2"],
  "documents": ["item1", "item2"],
  "electronics": ["item1", "item2"],
  "extras": ["item1", "item2"]
}

Be smart: pack more clothes for longer trips, add rain gear if weather is wet, add sunscreen if hot and sunny, adjust quantity based on packing style, adjust warmth of clothing based on temperature preference. Return only valid JSON, no other text.`
}
