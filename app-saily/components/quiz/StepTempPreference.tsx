'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { TempPreference } from '@/lib/types'

interface StepTempPreferenceProps {
  initialValue?: TempPreference
  onNext: (tempPreference: TempPreference) => void
}

const OPTIONS: { value: TempPreference; emoji: string; label: string }[] = [
  { value: 'cold', emoji: '🥶', label: 'I run cold' },
  { value: 'hot', emoji: '🥵', label: 'I run hot' },
  { value: 'normal', emoji: '😊', label: 'Somewhere in between' },
]

export default function StepTempPreference({ initialValue, onNext }: StepTempPreferenceProps) {
  const [selected, setSelected] = useState<TempPreference | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">How do you feel temperature?</h2>
        <p className="text-brand-text-secondary text-sm">This helps us suggest the right clothing</p>
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
        className="w-full py-3 rounded-xl bg-brand-gold text-brand-bg font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-hover transition-colors"
      >
        Build my packing list
      </button>
    </div>
  )
}
