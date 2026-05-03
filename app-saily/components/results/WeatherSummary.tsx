import type { WeatherData } from '@/lib/types'

interface WeatherSummaryProps {
  weather: WeatherData | null
}

export default function WeatherSummary({ weather }: WeatherSummaryProps) {
  if (!weather || weather.dailyForecasts.length === 0) {
    return (
      <div className="rounded-2xl bg-brand-surface/60 border border-brand-border px-5 py-4 text-center text-brand-text-muted text-sm">
        Weather unavailable — packing list based on your trip details.
      </div>
    )
  }

  const { city, requestedDays, dailyForecasts } = weather
  const isPartial = requestedDays > dailyForecasts.length

  return (
    <div className="rounded-2xl bg-brand-surface border border-brand-border/60 px-4 py-4">
      <div className="flex items-baseline justify-between mb-3 gap-2">
        <p className="font-semibold text-white text-sm">
          {city} · {requestedDays} {requestedDays === 1 ? 'day' : 'days'}
        </p>
        {isPartial && (
          <span className="text-xs text-brand-text-muted shrink-0">Based on 5-day forecast</span>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {dailyForecasts.map((day, idx) => (
          <div
            key={day.date}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 shrink-0 min-w-[60px] border transition-colors ${
              idx === 0
                ? 'bg-brand-gold/10 border-brand-gold/40 shadow-gold-sm'
                : 'bg-brand-bg border-brand-border/50'
            }`}
          >
            <span className="text-xs font-medium tracking-wide text-brand-text-secondary uppercase">
              {day.dayName}
            </span>
            <span className="text-xl leading-none">{day.emoji}</span>
            <span className={`text-sm font-semibold ${idx === 0 ? 'text-brand-gold' : 'text-white'}`}>
              {day.tempMax}°
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
