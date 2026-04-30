'use client'
import { useState } from 'react'

interface StepDestinationProps {
  initialDestination?: string
  initialDays?: number
  onNext: (destination: string, days: number) => void
}

export default function StepDestination({
  initialDestination = '',
  initialDays = 7,
  onNext,
}: StepDestinationProps) {
  const [destination, setDestination] = useState(initialDestination)
  const [days, setDays] = useState(initialDays)

  const canContinue = destination.trim().length > 0 && days > 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Where are you going?</h2>
        <p className="text-gray-500 text-sm">Enter your destination city</p>
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="e.g. Tokyo, Paris, New York"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How many days?
          </label>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 transition-colors"
          />
        </div>
      </div>
      <button
        onClick={() => onNext(destination.trim(), days)}
        disabled={!canContinue}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
