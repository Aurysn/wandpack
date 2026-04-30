'use client'

interface PackingCategoryProps {
  emoji: string
  title: string
  items: string[]
  checkedItems: Set<string>
  onToggle: (item: string) => void
}

export default function PackingCategory({
  emoji,
  title,
  items,
  checkedItems,
  onToggle,
}: PackingCategoryProps) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-4">
      <h3 className="font-semibold text-brand-gold mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, idx) => {
          const key = `${title}:${idx}:${item}`
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
                <span
                  className={`text-sm transition-colors ${
                    checked ? 'line-through text-brand-text-muted' : 'text-white'
                  }`}
                >
                  {item}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
