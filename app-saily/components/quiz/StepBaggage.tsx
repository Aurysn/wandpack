'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { BaggageType } from '@/lib/types'

interface StepBaggageProps {
  initialValue?: BaggageType
  onNext: (baggage: BaggageType) => void
}

const OPTIONS: { value: BaggageType; emoji: string; label: string }[] = [
  { value: 'hand', emoji: '👜', label: 'Hand luggage only' },
  { value: 'checked', emoji: '🧳', label: 'Checked bag' },
  { value: 'both', emoji: '✈️', label: 'Both' },
]

export default function StepBaggage({ initialValue, onNext }: StepBaggageProps) {
  const [selected, setSelected] = useState<BaggageType | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">What baggage are you bringing?</h2>
        <p className="text-gray-500 text-sm">Choose your luggage setup</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            emoji={opt.emoji}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
