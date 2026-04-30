import type { WeatherData } from './types'

export async function fetchWeather(
  city: string,
  apiKey: string
): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(apiKey)}`
    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json()
    return {
      city: data.name as string,
      temperature: Math.round(data.main.temp as number),
      description: data.weather[0].description as string,
    }
  } catch {
    return null
  }
}
