'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { PackingStyle } from '@/lib/types'

interface StepPackingStyleProps {
  initialValue?: PackingStyle
  onNext: (packingStyle: PackingStyle) => void
}

const OPTIONS: { value: PackingStyle; emoji: string; label: string }[] = [
  { value: 'light', emoji: '🪶', label: 'Pack light (only the essentials)' },
  { value: 'heavy', emoji: '📦', label: 'Pack heavy (bring everything just in case)' },
]

export default function StepPackingStyle({ initialValue, onNext }: StepPackingStyleProps) {
  const [selected, setSelected] = useState<PackingStyle | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">How do you like to pack?</h2>
        <p className="text-brand-text-secondary text-sm">Your packing philosophy</p>
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
        className="w-full py-3 rounded-xl bg-brand-gold text-brand-bg font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      >
        Continue
      </button>
    </div>
  )
}
