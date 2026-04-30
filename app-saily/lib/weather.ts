import type { WeatherData } from './types'

interface ForecastItem {
  dt: number
  main: { temp: number; temp_min: number; temp_max: number }
  weather: { description: string }[]
}

async function fetchCurrentWeather(city: string, apiKey: string): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(apiKey)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return {
      city: data.name as string,
      country: data.sys.country as string,
      temperature: Math.round(data.main.temp as number),
      tempMin: Math.round(data.main.temp_min as number),
      tempMax: Math.round(data.main.temp_max as number),
      description: data.weather[0].description as string,
      isForecast: false,
    }
  } catch {
    return null
  }
}

async function fetchForecastWeather(
  city: string,
  apiKey: string,
  departureDateMs: number,
  days: number
): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(apiKey)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()

    const returnDateMs = departureDateMs + days * 86_400_000
    const items: ForecastItem[] = (data.list as ForecastItem[]).filter((item) => {
      const ms = item.dt * 1000
      return ms >= departureDateMs && ms <= returnDateMs
    })

    if (items.length === 0) return null

    const temps = items.map((i) => i.main.temp)
    const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
    const minTemp = Math.round(Math.min(...items.map((i) => i.main.temp_min)))
    const maxTemp = Math.round(Math.max(...items.map((i) => i.main.temp_max)))

    // Pick the most common description
    const freq: Record<string, number> = {}
    for (const item of items) {
      const desc = item.weather[0].description
      freq[desc] = (freq[desc] ?? 0) + 1
    }
    const description = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]

    return {
      city: data.city.name as string,
      country: data.city.country as string,
      temperature: avgTemp,
      tempMin: minTemp,
      tempMax: maxTemp,
      description,
      isForecast: true,
    }
  } catch {
    return null
  }
}

export async function fetchWeather(
  city: string,
  apiKey: string,
  departureDate: string,
  days: number
): Promise<WeatherData | null> {
  const departureDateMs = new Date(departureDate).getTime()
  const daysUntilTrip = (departureDateMs - Date.now()) / 86_400_000

  if (daysUntilTrip <= 4.5 && days <= 5) {
    const forecast = await fetchForecastWeather(city, apiKey, departureDateMs, days)
    if (forecast) return forecast
  }

  return fetchCurrentWeather(city, apiKey)
}
