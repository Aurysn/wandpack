'use client'
import { useState, useMemo } from 'react'
import WeatherSummary from './WeatherSummary'
import PackingCategory from './PackingCategory'
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

export default function ResultsScreen({ weather, packingList, destination, onStartOver }: ResultsScreenProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [customItems, setCustomItems] = useState<Partial<Record<keyof PackingList, string[]>>>({})
  const [view, setView] = useState<'list' | 'done'>('list')

  function toggle(key: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function addCustomItem(catKey: keyof PackingList, item: string) {
    setCustomItems((prev) => ({
      ...prev,
      [catKey]: [...(prev[catKey] ?? []), item],
    }))
  }

  const packedSummary = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const regularItems = packingList[cat.key]
      const customCatItems = customItems[cat.key] ?? []

      const packedRegular = regularItems.filter((item, idx) =>
        checkedItems.has(`${cat.key}:${idx}:${item}`)
      )
      const packedCustom = customCatItems.filter((item, idx) =>
        checkedItems.has(`${cat.key}:custom:${idx}:${item}`)
      )

      return { ...cat, packedItems: [...packedRegular, ...packedCustom] }
    }).filter((cat) => cat.packedItems.length > 0)
  }, [checkedItems, customItems, packingList])

  const cityName = destination.split(',')[0].trim()

  if (view === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center py-1">
          <h2 className="text-xl font-bold text-white leading-snug">
            Here&apos;s what you&apos;re bringing to {cityName} 🗺️
          </h2>
        </div>

        {packedSummary.length === 0 ? (
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 text-center text-brand-text-secondary text-sm">
            You didn&apos;t check any items — no worries, your list is in your head!
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 flex flex-col gap-3">
            {packedSummary.map((cat) => (
              <div key={cat.key}>
                <span className="font-semibold text-brand-gold text-sm">
                  {cat.emoji} {cat.title} ({cat.packedItems.length} {cat.packedItems.length === 1 ? 'item' : 'items'}):
                </span>{' '}
                <span className="text-sm text-white">{cat.packedItems.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-brand-text-secondary text-sm py-1">
          You&apos;re all packed and ready! ✨
        </p>

        <div className="rounded-2xl border border-brand-gold/30 bg-brand-surface p-5 flex flex-col gap-3 shadow-gold-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5" aria-hidden="true">📶</span>
            <div>
              <h3 className="text-brand-text-primary font-semibold text-base leading-snug">
                Stay Connected Abroad
              </h3>
              <p className="text-brand-text-secondary text-sm mt-1 leading-relaxed">
                Don&apos;t forget your data plan! Saily offers lightning-fast eSIM coverage in 200+
                destinations — no roaming fees, no plastic SIM cards. Use code{' '}
                <span className="text-brand-gold font-semibold">AURIMA4014</span>{' '}
                at checkout to get $5 off your first plan!
              </p>
            </div>
          </div>
          <a
            href="https://saily.onelink.me/ymzx/referrals"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl border border-brand-gold/60 text-brand-gold text-sm font-semibold text-center hover:bg-brand-gold/10 hover:border-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Get $5 off your first Saily eSIM →
          </a>
        </div>

        <button
          onClick={onStartOver}
          className="w-full py-3 rounded-xl border-2 border-brand-border text-brand-text-secondary font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
        >
          Start over
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <WeatherSummary weather={weather} />
      {CATEGORIES.map((cat) => (
        <PackingCategory
          key={cat.key}
          catKey={cat.key}
          emoji={cat.emoji}
          title={cat.title}
          items={packingList[cat.key]}
          customItems={customItems[cat.key] ?? []}
          checkedItems={checkedItems}
          onToggle={toggle}
          onAddCustomItem={(item) => addCustomItem(cat.key, item)}
        />
      ))}
      <button
        onClick={() => setView('done')}
        className="w-full py-3.5 rounded-xl bg-brand-gold text-brand-bg font-bold text-base hover:bg-brand-gold-hover transition-colors shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      >
        Done Packing 🧳
      </button>
    </div>
  )
}
