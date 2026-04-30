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
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  )
}
