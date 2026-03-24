export default function StreakList({ streaks = [] }) {
  if (!streaks.length) return (
    <p className="text-zinc-600 text-sm text-center py-8">No streak data yet.</p>
  )

  return (
    <div className="flex flex-col gap-3">
      {streaks.map(s => (
        <div
          key={s.id}
          className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3"
        >
          <span className="text-sm text-zinc-300">{s.name}</span>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-zinc-600">Current</p>
              <p className="text-base font-black text-orange-500">
                {s.current > 0 ? `${s.current}🔥` : '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-600">Best</p>
              <p className="text-base font-black text-white">{s.best || '—'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}