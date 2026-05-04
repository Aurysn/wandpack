'use client'
import { useEffect, useState } from 'react'
import { fetchWeather } from '@/lib/weather'
import type { QuizAnswers, WeatherData, PackingList } from '@/lib/types'

const MAX_ATTEMPTS = 4
const RETRY_DELAY_MS = 3000

interface LoadingScreenProps {
  answers: QuizAnswers
  onComplete: (weather: WeatherData | null, packingList: PackingList) => void
  onError: (message: string) => void
}

export default function LoadingScreen({ answers, onComplete, onError }: LoadingScreenProps) {
  const [attempt, setAttempt] = useState(1)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? ''
      const weather = await fetchWeather(
        answers.destination,
        apiKey,
        answers.departureDate,
        answers.days
      )

      for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        if (cancelled) return

        if (i > 1) {
          setRetrying(true)
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
          if (cancelled) return
          setAttempt(i)
          setRetrying(false)
        }

        try {
          const res = await fetch('/api/generate-packing-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, weather }),
          })

          if (!res.ok) throw new Error('API error')
          const packingList: PackingList = await res.json()
          if (!cancelled) onComplete(weather, packingList)
          return
        } catch {
          if (i === MAX_ATTEMPTS) {
            if (!cancelled)
              onError('Sorry, we could not generate your packing list. Please try again.')
          }
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentional: run once on mount, callbacks are stable for this screen's lifetime

  const subtext =
    retrying || attempt > 1 ? 'Still working on it...' : 'Weaving your perfect packing spell...'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-brand-gold/20 border-b-brand-gold/60 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">Building your packing list...</p>
          <p className="text-sm text-brand-text-secondary mt-1.5">{subtext}</p>
        </div>
      </div>
    </div>
  )
}
