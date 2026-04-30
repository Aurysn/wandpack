'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { BaggageType } from '@/lib/types'

interface StepBaggageProps {
  initialValue?: BaggageType
  onNext: (baggage: BaggageType) => void
}

const OPTIONS: { value: BaggageType; emoji: string; label: string }[] = [
  { value: 'hand', emoji: '👜', label: 'Hand luggage' },
  { value: 'checked', emoji: '🧳', label: 'Checked bag' },
  { value: 'both', emoji: '✈️', label: 'Both' },
]

export default function StepBaggage({ initialValue, onNext }: StepBaggageProps) {
  const [selected, setSelected] = useState<BaggageType | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">What baggage are you bringing?</h2>
        <p className="text-brand-text-secondary text-sm">Choose your luggage setup</p>
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
        className="w-full py-3 rounded-xl bg-brand-gold text-brand-bg font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      >
        Continue
      </button>
    </div>
  )
}
