interface PackingProgressProps {
  packed: number
  total: number
}

export default function PackingProgress({ packed, total }: PackingProgressProps) {
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100)

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-brand-text-secondary">Packing progress</span>
        <span className="text-sm font-semibold text-brand-gold">
          {packed} of {total} items packed
        </span>
      </div>
      <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-gold rounded-full transition-all duration-300 shadow-gold-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
