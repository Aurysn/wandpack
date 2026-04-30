'use client'
import { useState, useRef, useEffect } from 'react'
import { useCityAutocomplete } from '@/hooks/useCityAutocomplete'
import type { CitySuggestion } from '@/lib/types'

const today = new Date().toLocaleDateString('en-CA')

interface StepDestinationProps {
  initialDestination?: string
  initialDays?: number
  initialDepartureDate?: string
  onNext: (destination: string, days: number, departureDate: string) => void
}

export default function StepDestination({
  initialDestination = '',
  initialDays = 7,
  initialDepartureDate = today,
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
      if (activeIndex >= 0) {
        selectCity(suggestions[activeIndex])
      } else if (suggestions.length === 1) {
        selectCity(suggestions[0])
      }
    } else if (e.key === 'Escape') {
      clear()
      setActiveIndex(-1)
    }
  }

  // Close dropdown when clicking outside
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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Where are you going?</h2>
        <p className="text-gray-500 text-sm">Enter your destination city</p>
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
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
          />
          {suggestions.length > 0 && (
            <ul
              ref={dropdownRef}
              className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
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
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-900 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="ml-2 text-xs text-gray-400">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure date</label>
          <input
            type="date"
            min={today}
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 transition-colors"
          />
        </div>

        {/* Trip duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How many days?</label>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              setDays(isNaN(val) ? 1 : Math.max(1, val))
            }}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 transition-colors"
          />
        </div>
      </div>
      <button
        onClick={() => onNext(inputValue.trim(), days, departureDate)}
        disabled={!canContinue}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
