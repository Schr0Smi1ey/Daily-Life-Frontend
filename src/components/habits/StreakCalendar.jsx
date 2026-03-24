export default function StreakCalendar({ habits }) {
  const weeks = 12
  const days = weeks * 7

  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().split('T')[0]
    const total = habits.length
    const done = habits.filter(h => h.checkins?.some(c => c.date === key)).length
    return { key, total, done }
  })

  const weeks_ = []
  for (let w = 0; w < weeks; w++) {
    weeks_.push(cells.slice(w * 7, w * 7 + 7))
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1">
        {weeks_.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) => {
              const pct = cell.total ? cell.done / cell.total : 0
              const bg = pct === 0
                ? 'bg-zinc-800'
                : pct < 0.5
                ? 'bg-orange-500/30'
                : pct < 1
                ? 'bg-orange-500/60'
                : 'bg-orange-500'

              return (
                <div
                  key={di}
                  title={`${cell.key}: ${cell.done}/${cell.total}`}
                  className={`w-3 h-3 rounded-sm ${bg}`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-zinc-600">Less</span>
        {['bg-zinc-800', 'bg-orange-500/30', 'bg-orange-500/60', 'bg-orange-500'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-xs text-zinc-600">More</span>
      </div>
    </div>
  )
}