'use client'
import { useState } from 'react'

interface PackingCategoryProps {
  catKey: string
  emoji: string
  title: string
  items: string[]
  customItems: string[]
  checkedItems: Set<string>
  onToggle: (key: string) => void
  onAddCustomItem: (item: string) => void
}

export default function PackingCategory({
  catKey,
  emoji,
  title,
  items,
  customItems,
  checkedItems,
  onToggle,
  onAddCustomItem,
}: PackingCategoryProps) {
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState('')

  function handleAdd() {
    const trimmed = newItem.trim()
    if (!trimmed) return
    onAddCustomItem(trimmed)
    setNewItem('')
    setAdding(false)
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-4">
      <h3 className="font-semibold text-brand-gold mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, idx) => {
          const key = `${catKey}:${idx}:${item}`
          const checked = checkedItems.has(key)
          return (
            <li key={key}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                  className="w-4 h-4 rounded checkbox-gold cursor-pointer shrink-0"
                />
                <span className={`text-sm transition-colors ${checked ? 'line-through text-brand-text-muted' : 'text-white'}`}>
                  {item}
                </span>
              </label>
            </li>
          )
        })}
        {customItems.map((item, idx) => {
          const key = `${catKey}:custom:${idx}:${item}`
          const checked = checkedItems.has(key)
          return (
            <li key={key}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                  className="w-4 h-4 rounded checkbox-gold cursor-pointer shrink-0"
                />
                <span className={`text-sm transition-colors ${checked ? 'line-through text-brand-text-muted' : 'text-white'}`}>
                  {item}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      {adding ? (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') { setAdding(false); setNewItem('') }
            }}
            placeholder="e.g. Neck pillow"
            autoFocus
            className="flex-1 text-sm bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-white placeholder:text-brand-text-muted focus:outline-none focus:border-brand-gold/60"
          />
          <button
            onClick={handleAdd}
            className="text-sm text-brand-gold font-semibold px-2 hover:opacity-75 transition-opacity"
          >
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setNewItem('') }}
            className="text-sm text-brand-text-muted px-1 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 text-xs text-brand-text-muted hover:text-brand-gold transition-colors"
        >
          + Add your own item
        </button>
      )}
    </div>
  )
}
