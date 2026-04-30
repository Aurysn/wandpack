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
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span
                  className={`text-sm transition-colors ${
                    checked ? 'line-through text-gray-400' : 'text-gray-700'
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
