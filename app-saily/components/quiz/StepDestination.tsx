'use client'
import { useState, useRef, useEffect } from 'react'
import { useCityAutocomplete } from '@/hooks/useCityAutocomplete'
import type { CitySuggestion } from '@/lib/types'

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString('en-CA')
}
const tomorrow = getTomorrow()

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-brand-border bg-brand-surface focus:border-brand-gold focus:outline-none text-white placeholder-brand-text-muted transition-colors'

const labelClass = 'block text-sm font-medium text-brand-text-secondary mb-1'

interface StepDestinationProps {
  initialDestination?: string
  initialDays?: number
  initialDepartureDate?: string
  onNext: (destination: string, days: number, departureDate: string) => void
}

export default function StepDestination({
  initialDestination = '',
  initialDays = 7,
  initialDepartureDate = tomorrow,
  onNext,
}: StepDestinationProps) {
  const [inputValue, setInputValue] = useState(initialDestination)
  const [days, setDays] = useState(initialDays)
  const [departureDate, setDepartureDate] = useState(initialDepartureDate)
  const [activeIndex, setActiveIndex] = useState(-1)
  const dropdownRef = useRef<HTMLUListElement>(null)

  const { suggestions, clear } = useCityAutocomplete(inputValue)

  const canContinue = inputValue.trim().length > 0 && days > 0 && departureDate !== ''

  function selectCity(city: CitySuggestion) {
    setInputValue(`${city.name}, ${city.country}`)
    setActiveIndex(-1)
    clear()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0) selectCity(suggestions[activeIndex])
      else if (suggestions.length === 1) selectCity(suggestions[0])
    } else if (e.key === 'Escape') {
      clear()
      setActiveIndex(-1)
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        clear()
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clear])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Where are you going?</h2>
        <p className="text-brand-text-secondary text-sm">Enter your destination city</p>
      </div>
      <div className="flex flex-col gap-4">
        {/* City input with autocomplete */}
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Tokyo, Paris, Vilnius"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setActiveIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className={inputClass}
          />
          {suggestions.length > 0 && (
            <ul
              ref={dropdownRef}
              className="absolute z-50 mt-1 w-full rounded-xl border border-brand-border bg-brand-surface shadow-xl overflow-hidden"
            >
              {suggestions.map((city, idx) => (
                <li key={`${city.lat}-${city.lon}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      selectCity(city)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      idx === activeIndex
                        ? 'bg-brand-surface-hover text-brand-gold'
                        : 'text-white hover:bg-brand-surface-hover hover:text-brand-gold'
                    }`}
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="ml-2 text-xs text-brand-text-muted">
                      {city.country}
                      {city.state ? ` · ${city.state}` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Departure date */}
        <div>
          <label className={labelClass}>Departure date</label>
          <input
            type="date"
            min={tomorrow}
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Trip duration */}
        <div>
          <label className={labelClass}>How many days?</label>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              setDays(isNaN(val) ? 1 : Math.max(1, val))
            }}
            className={inputClass}
          />
        </div>
      </div>
      <button
        onClick={() => onNext(inputValue.trim(), days, departureDate)}
        disabled={!canContinue}
        className="w-full py-3 rounded-xl bg-brand-gold text-brand-bg font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      >
        Continue
      </button>
    </div>
  )
}
