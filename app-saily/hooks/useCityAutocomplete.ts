'use client'
import { useState, useEffect } from 'react'
import { fetchCitySuggestions } from '@/lib/geocoding'
import type { CitySuggestion } from '@/lib/types'

export function useCityAutocomplete(query: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? ''
      const results = await fetchCitySuggestions(query, apiKey)
      setSuggestions(results)
      setIsLoading(false)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  function clear() {
    setSuggestions([])
  }

  return { suggestions, isLoading, clear }
}
