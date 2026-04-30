import type { CitySuggestion } from './types'

export async function fetchCitySuggestions(
  query: string,
  apiKey: string,
  limit = 5
): Promise<CitySuggestion[]> {
  if (query.trim().length < 2) return []
  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${encodeURIComponent(apiKey)}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (
      data as Array<{ name: string; country: string; state?: string; lat: number; lon: number }>
    ).map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }))
  } catch {
    return []
  }
}
