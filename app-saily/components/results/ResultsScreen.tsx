'use client'
import { useState, useMemo } from 'react'
import WeatherSummary from './WeatherSummary'
import PackingCategory from './PackingCategory'
import type { WeatherData, PackingList, PackingCategoryKey, QuizAnswers, PackingEvaluation } from '@/lib/types'

interface ResultsScreenProps {
  weather: WeatherData | null
  packingList: PackingList
  answers: QuizAnswers
  destination: string
  onStartOver: () => void
}

const CATEGORIES: { key: PackingCategoryKey; emoji: string; title: string }[] = [
  { key: 'clothes', emoji: '👕', title: 'Clothes' },
  { key: 'toiletries', emoji: '🧴', title: 'Toiletries' },
  { key: 'documents', emoji: '📄', title: 'Documents' },
  { key: 'electronics', emoji: '💻', title: 'Electronics' },
  { key: 'extras', emoji: '🎒', title: 'Extras' },
]

function parseItem(raw: string): { quantity: number | null; displayName: string } {
  const match = raw.match(/^(\d+)(?:\s*x)?\s+(.+)$/)
  if (match) {
    const quantity = parseInt(match[1])
    const displayName = match[2]
      .replace(/\s*\([^)]*\)/g, '')
      .split('/')[0]
      .trim()
    return { quantity, displayName }
  }
  const displayName = raw
    .replace(/\s*\([^)]*\)/g, '')
    .split('/')[0]
    .trim()
  return { quantity: null, displayName }
}

export default function ResultsScreen({ weather, packingList, answers, destination, onStartOver }: ResultsScreenProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [customItems, setCustomItems] = useState<Partial<Record<PackingCategoryKey, string[]>>>({})
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set())
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [view, setView] = useState<'list' | 'evaluating' | 'done'>('list')
  const [evaluation, setEvaluation] = useState<PackingEvaluation | null>(null)

  function toggle(key: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function removeItem(key: string) {
    setRemovedItems((prev) => { const next = new Set(prev); next.add(key); return next })
    setCheckedItems((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  function changeQuantity(key: string, delta: number, currentQty: number) {
    const newQty = Math.max(1, currentQty + delta)
    setQuantities((prev) => ({ ...prev, [key]: newQty }))
  }

  function addCustomItem(catKey: PackingCategoryKey, item: string) {
    setCustomItems((prev) => ({
      ...prev,
      [catKey]: [...(prev[catKey] ?? []), item],
    }))
  }

  const packedSummary = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const regularItems = packingList[cat.key]
      const customCatItems = customItems[cat.key] ?? []

      const packedRegular = regularItems
        .map((item, idx) => {
          const key = `${cat.key}:${idx}:${item}`
          if (removedItems.has(key) || !checkedItems.has(key)) return null
          const { quantity, displayName } = parseItem(item)
          if (quantity !== null) {
            const currentQty = quantities[key] ?? quantity
            return `${currentQty} ${displayName}`
          }
          return displayName
        })
        .filter((x): x is string => x !== null)

      const packedCustom = customCatItems
        .map((item, idx) => {
          const key = `${cat.key}:custom:${idx}:${item}`
          if (removedItems.has(key) || !checkedItems.has(key)) return null
          const { quantity, displayName } = parseItem(item)
          if (quantity !== null) {
            const currentQty = quantities[key] ?? quantity
            return `${currentQty} ${displayName}`
          }
          return displayName
        })
        .filter((x): x is string => x !== null)

      return { ...cat, packedItems: [...packedRegular, ...packedCustom] }
    }).filter((cat) => cat.packedItems.length > 0)
  }, [checkedItems, customItems, removedItems, quantities, packingList])

  const cityName = destination.split(',')[0].trim()

  async function handleDonePacking() {
    setView('evaluating')
    const allPackedItems = packedSummary.flatMap((cat) => cat.packedItems)
    try {
      const res = await fetch('/api/evaluate-packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, weather, packedItems: allPackedItems }),
      })
      if (res.ok) {
        const data: PackingEvaluation = await res.json()
        setEvaluation(data)
      }
    } catch {
      // silently skip on failure
    } finally {
      setView('done')
    }
  }

  if (view === 'evaluating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-brand-gold/20 border-b-brand-gold/60 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🪄</div>
        </div>

        <div className="text-center flex flex-col gap-1.5">
          <p className="text-base font-semibold text-white">Evaluating your packing list...</p>
          <p className="text-sm text-brand-text-secondary">Checking everything against your trip details</p>
        </div>

        <div className="flex gap-2 items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (view === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center py-1">
          <h2 className="text-xl font-bold text-white leading-snug">
            Here&apos;s what you&apos;re bringing to {cityName} 🗺️
          </h2>
        </div>

        {evaluation && (
          <div className={`rounded-2xl border px-5 py-4 flex flex-col gap-2 ${
            evaluation.score === 'great'
              ? 'border-green-700/40 bg-green-950/30'
              : evaluation.score === 'good'
              ? 'border-brand-gold/30 bg-brand-surface'
              : 'border-red-700/40 bg-red-950/20'
          }`}>
            <p className="font-semibold text-sm text-white">
              {evaluation.score === 'great' && '✅ '}
              {evaluation.score === 'good' && '👍 '}
              {evaluation.score === 'missing-essentials' && '⚠️ '}
              {evaluation.message}
            </p>
            {evaluation.warnings.length > 0 && (
              <ul className="flex flex-col gap-1 mt-1">
                {evaluation.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-brand-text-muted flex items-center gap-1.5">
                    <span className="text-red-400">•</span> {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

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
      <WeatherSummary weather={weather} weatherSummary={packingList.weatherSummary} />
      {CATEGORIES.map((cat) => (
        <PackingCategory
          key={cat.key}
          catKey={cat.key}
          emoji={cat.emoji}
          title={cat.title}
          items={packingList[cat.key]}
          customItems={customItems[cat.key] ?? []}
          checkedItems={checkedItems}
          removedItems={removedItems}
          quantities={quantities}
          onToggle={toggle}
          onRemoveItem={removeItem}
          onChangeQuantity={changeQuantity}
          onAddCustomItem={(item) => addCustomItem(cat.key, item)}
        />
      ))}
      <button
        onClick={handleDonePacking}
        className="w-full py-3.5 rounded-xl bg-brand-gold text-brand-bg font-bold text-base hover:bg-brand-gold-hover transition-colors shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      >
        Done Packing 🧳
      </button>
    </div>
  )
}
