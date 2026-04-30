'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { TripType } from '@/lib/types'

interface StepTripTypeProps {
  initialValue?: TripType
  onNext: (tripType: TripType) => void
}

const OPTIONS: { value: TripType; emoji: string; label: string }[] = [
  { value: 'beach', emoji: '🏖️', label: 'Beach' },
  { value: 'city', emoji: '🏙️', label: 'City trip' },
  { value: 'business', emoji: '💼', label: 'Business' },
  { value: 'hiking', emoji: '🥾', label: 'Hiking' },
]

export default function StepTripType({ initialValue, onNext }: StepTripTypeProps) {
  const [selected, setSelected] = useState<TripType | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">What kind of trip?</h2>
        <p className="text-brand-text-secondary text-sm">Choose the type that fits best</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
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
        className="w-full py-3 rounded-xl bg-brand-gold text-brand-bg font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-hover transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
