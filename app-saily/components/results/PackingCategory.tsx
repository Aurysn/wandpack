'use client'
import { useId, useState } from 'react'

interface PackingCategoryProps {
  catKey: string
  emoji: string
  title: string
  items: string[]
  customItems: string[]
  checkedItems: Set<string>
  removedItems: Set<string>
  quantities: Record<string, number>
  onToggle: (key: string) => void
  onRemoveItem: (key: string) => void
  onChangeQuantity: (key: string, delta: number, currentQty: number) => void
  onAddCustomItem: (item: string) => void
}

function parseItem(raw: string): { quantity: number | null; displayName: string } {
  const match = raw.match(/^(\d+)x?\s+(.+)$/)
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

interface ItemRowProps {
  itemKey: string
  rawName: string
  checked: boolean
  quantities: Record<string, number>
  onToggle: (key: string) => void
  onRemoveItem: (key: string) => void
  onChangeQuantity: (key: string, delta: number, currentQty: number) => void
  onFadeStart: (key: string) => void
}

function ItemRow({ itemKey, rawName, checked, quantities, onToggle, onRemoveItem, onChangeQuantity, onFadeStart }: ItemRowProps) {
  const inputId = useId()
  const { quantity, displayName } = parseItem(rawName)
  const currentQty = quantity !== null ? (quantities[itemKey] ?? quantity) : null

  function handleRemove() {
    onFadeStart(itemKey)
    setTimeout(() => onRemoveItem(itemKey), 200)
  }

  return (
    <div className="flex items-center gap-2 group">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(itemKey)}
        className="w-4 h-4 rounded checkbox-gold cursor-pointer shrink-0"
      />
      <label
        htmlFor={inputId}
        className={`text-sm flex-1 cursor-pointer transition-colors select-none ${
          checked ? 'line-through text-brand-text-muted' : 'text-white'
        }`}
      >
        {currentQty !== null ? `${currentQty} ${displayName}` : displayName}
      </label>
      {currentQty !== null && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onChangeQuantity(itemKey, -1, currentQty)}
            disabled={currentQty <= 1}
            className="w-5 h-5 rounded text-brand-gold text-xs font-bold leading-none hover:bg-brand-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <button
            onClick={() => onChangeQuantity(itemKey, +1, currentQty)}
            className="w-5 h-5 rounded text-brand-gold text-xs font-bold leading-none hover:bg-brand-gold/20 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleRemove}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 [@media(pointer:coarse)]:opacity-40 transition-opacity text-brand-text-muted hover:text-red-400 text-xs shrink-0 px-0.5"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  )
}

export default function PackingCategory({
  catKey,
  emoji,
  title,
  items,
  customItems,
  checkedItems,
  removedItems,
  quantities,
  onToggle,
  onRemoveItem,
  onChangeQuantity,
  onAddCustomItem,
}: PackingCategoryProps) {
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [fadingKeys, setFadingKeys] = useState<Set<string>>(new Set())

  function handleAdd() {
    const trimmed = newItem.trim()
    if (!trimmed) return
    onAddCustomItem(trimmed)
    setNewItem('')
    setAdding(false)
  }

  function handleFadeStart(key: string) {
    setFadingKeys((prev) => { const next = new Set(prev); next.add(key); return next })
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-4">
      <h3 className="font-semibold text-brand-gold mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, idx) => {
          const key = `${catKey}:${idx}:${item}`
          if (removedItems.has(key)) return null
          const fading = fadingKeys.has(key)
          return (
            <li
              key={key}
              className={`transition-opacity duration-200 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ItemRow
                itemKey={key}
                rawName={item}
                checked={checkedItems.has(key)}
                quantities={quantities}
                onToggle={onToggle}
                onRemoveItem={onRemoveItem}
                onChangeQuantity={onChangeQuantity}
                onFadeStart={handleFadeStart}
              />
            </li>
          )
        })}
        {customItems.map((item, idx) => {
          const key = `${catKey}:custom:${idx}:${item}`
          if (removedItems.has(key)) return null
          const fading = fadingKeys.has(key)
          return (
            <li
              key={key}
              className={`transition-opacity duration-200 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ItemRow
                itemKey={key}
                rawName={item}
                checked={checkedItems.has(key)}
                quantities={quantities}
                onToggle={onToggle}
                onRemoveItem={onRemoveItem}
                onChangeQuantity={onChangeQuantity}
                onFadeStart={handleFadeStart}
              />
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
