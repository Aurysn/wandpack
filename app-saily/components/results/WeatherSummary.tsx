import type { WeatherData } from '@/lib/types'

interface WeatherSummaryProps {
  weather: WeatherData | null
}

export default function WeatherSummary({ weather }: WeatherSummaryProps) {
  if (!weather) {
    return (
      <div className="rounded-2xl bg-gray-100 px-5 py-4 text-center text-gray-500 text-sm">
        Weather data unavailable — packing list based on your preferences only.
      </div>
    )
  }

  const tempDisplay =
    weather.isForecast && weather.tempMin !== undefined && weather.tempMax !== undefined
      ? `${weather.tempMin}–${weather.tempMax}°C`
      : `${weather.temperature}°C`

  const subtext = weather.isForecast ? `avg ${weather.temperature}°C · forecast for your trip` : 'current conditions'

  return (
    <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-5 py-4 flex items-center gap-3">
      <span className="text-3xl">🌤️</span>
      <div>
        <p className="font-semibold text-gray-900">
          {weather.city} · {tempDisplay}
        </p>
        <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
        <p className="text-xs text-indigo-400 mt-0.5">{subtext}</p>
      </div>
    </div>
  )
}
