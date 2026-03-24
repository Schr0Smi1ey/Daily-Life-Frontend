const MOODS = [
  { value: 1, emoji: '😔', label: 'Rough'   },
  { value: 2, emoji: '😐', label: 'Meh'     },
  { value: 3, emoji: '🙂', label: 'Okay'    },
  { value: 4, emoji: '😊', label: 'Good'    },
  { value: 5, emoji: '🔥', label: 'Amazing' },
]

export { MOODS }

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {MOODS.map(mood => (
        <button
          key={mood.value}
          onClick={() => onChange(mood.value)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition ${
            value === mood.value
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-white/10 bg-zinc-800 hover:border-white/20'
          }`}
        >
          <span className="text-xl">{mood.emoji}</span>
          <span className="text-xs text-zinc-500">{mood.label}</span>
        </button>
      ))}
    </div>
  )
}