'use client'
import { useState, useMemo } from 'react'
import WeatherSummary from './WeatherSummary'
import PackingCategory from './PackingCategory'
import PackingProgress from './PackingProgress'
import type { WeatherData, PackingList } from '@/lib/types'

interface ResultsScreenProps {
  weather: WeatherData | null
  packingList: PackingList
  destination: string
  onStartOver: () => void
}

const CATEGORIES: { key: keyof PackingList; emoji: string; title: string }[] = [
  { key: 'clothes', emoji: '👕', title: 'Clothes' },
  { key: 'toiletries', emoji: '🧴', title: 'Toiletries' },
  { key: 'documents', emoji: '📄', title: 'Documents' },
  { key: 'electronics', emoji: '💻', title: 'Electronics' },
  { key: 'extras', emoji: '🎒', title: 'Extras' },
]

export default function ResultsScreen({
  weather,
  packingList,
  destination,
  onStartOver,
}: ResultsScreenProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const totalItems = useMemo(
    () => CATEGORIES.reduce((sum, cat) => sum + packingList[cat.key].length, 0),
    [packingList]
  )

  function toggle(key: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <WeatherSummary weather={weather} destination={destination} />
      <PackingProgress packed={checkedItems.size} total={totalItems} />
      {CATEGORIES.map((cat) => (
        <PackingCategory
          key={cat.key}
          emoji={cat.emoji}
          title={cat.title}
          items={packingList[cat.key]}
          checkedItems={checkedItems}
          onToggle={toggle}
        />
      ))}
      <button
        onClick={onStartOver}
        className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-colors"
      >
        Start over
      </button>
    </div>
  )
}
