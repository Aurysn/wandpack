'use client'

interface ChoiceCardProps {
  emoji: string
  label: string
  selected: boolean
  onClick: () => void
}

export default function ChoiceCard({ emoji, label, selected, onClick }: ChoiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 w-full cursor-pointer ${
        selected
          ? 'border-brand-gold bg-brand-surface-hover text-brand-gold shadow-gold'
          : 'border-brand-border bg-brand-surface text-brand-text-secondary hover:border-brand-gold/40 hover:bg-brand-surface-hover hover:text-white'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  )
}
