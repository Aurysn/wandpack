import type { WeatherData, DailyForecast } from './types'

interface ForecastEntry {
  dt: number
  dt_txt: string
  main: { temp: number; temp_min: number; temp_max: number }
  weather: { id: number; description: string }[]
}

function weatherEmoji(id: number): string {
  if (id >= 200 && id < 300) return '⛈️'
  if (id >= 300 && id < 400) return '🌦️'
  if (id >= 500 && id < 600) return '🌧️'
  if (id >= 600 && id < 700) return '❄️'
  if (id >= 700 && id < 800) return '🌫️'
  if (id === 800) return '☀️'
  if (id === 801 || id === 802) return '🌤️'
  return '☁️'
}

export async function fetchWeather(
  city: string,
  apiKey: string,
  departureDate: string,
  days: number
): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(apiKey)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()

    // Group forecast entries by date (YYYY-MM-DD)
    const byDate: Record<string, ForecastEntry[]> = {}
    for (const entry of data.list as ForecastEntry[]) {
      const date = entry.dt_txt.slice(0, 10)
      if (!byDate[date]) byDate[date] = []
      byDate[date].push(entry)
    }

    // Filter to dates from departure onwards, cap at min(days, 5)
    const capDays = Math.min(days, 5)
    const tripDates = Object.keys(byDate)
      .sort()
      .filter((d) => d >= departureDate)
      .slice(0, capDays)

    if (tripDates.length === 0) return null

    const dailyForecasts: DailyForecast[] = tripDates.map((date) => {
      const entries = byDate[date]
      // Take the reading closest to noon for the representative condition
      const noon = entries.reduce((best, e) => {
        const hour = parseInt(e.dt_txt.slice(11, 13))
        const bestHour = parseInt(best.dt_txt.slice(11, 13))
        return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? e : best
      })

      const tempMin = Math.round(Math.min(...entries.map((e) => e.main.temp_min)))
      const tempMax = Math.round(Math.max(...entries.map((e) => e.main.temp_max)))
      const id = noon.weather[0].id
      const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })

      return {
        date,
        dayName,
        tempMin,
        tempMax,
        description: noon.weather[0].description,
        emoji: weatherEmoji(id),
      }
    })

    const allMins = dailyForecasts.map((d) => d.tempMin)
    const allMaxes = dailyForecasts.map((d) => d.tempMax)
    const tripMin = Math.min(...allMins)
    const tripMax = Math.max(...allMaxes)
    const tripAvg = Math.round((tripMin + tripMax) / 2)

    const freq: Record<string, number> = {}
    for (const d of dailyForecasts) {
      freq[d.description] = (freq[d.description] ?? 0) + 1
    }
    const dominantDesc = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]

    return {
      city: data.city.name as string,
      country: data.city.country as string,
      temperature: tripAvg,
      tempMin: tripMin,
      tempMax: tripMax,
      description: dominantDesc,
      isForecast: true,
      requestedDays: days,
      dailyForecasts,
    }
  } catch {
    return null
  }
}
