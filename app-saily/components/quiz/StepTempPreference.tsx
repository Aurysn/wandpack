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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">How do you feel temperature?</h2>
        <p className="text-gray-500 text-sm">This helps us suggest the right clothing</p>
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
        Build my packing list
      </button>
    </div>
  )
}
