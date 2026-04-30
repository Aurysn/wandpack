interface PackingProgressProps {
  packed: number
  total: number
}

export default function PackingProgress({ packed, total }: PackingProgressProps) {
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Packing progress</span>
        <span className="text-sm font-semibold text-indigo-600">
          {packed} of {total} items packed
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
