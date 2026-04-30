import type { WeatherData } from '@/lib/types'

interface WeatherSummaryProps {
  weather: WeatherData | null
}

export default function WeatherSummary({ weather }: WeatherSummaryProps) {
  if (!weather) {
    return (
      <div className="rounded-2xl bg-brand-surface/60 border border-brand-border px-5 py-4 text-center text-brand-text-muted text-sm">
        Weather data unavailable — packing list based on your preferences only.
      </div>
    )
  }

  const tempDisplay =
    weather.isForecast && weather.tempMin !== undefined && weather.tempMax !== undefined
      ? `${weather.tempMin}–${weather.tempMax}°C`
      : `${weather.temperature}°C`

  const subtext = weather.isForecast
    ? `avg ${weather.temperature}°C · forecast for your trip`
    : 'current conditions'

  return (
    <div className="rounded-2xl bg-brand-surface/80 border border-brand-border/60 px-5 py-4 flex items-center gap-4 backdrop-blur-sm">
      <span className="text-3xl shrink-0">🌤️</span>
      <div>
        <p className="font-semibold text-white">
          {weather.city} · {tempDisplay}
        </p>
        <p className="text-sm text-brand-text-secondary capitalize">{weather.description}</p>
        <p className="text-xs text-brand-text-muted mt-0.5">{subtext}</p>
      </div>
    </div>
  )
}
