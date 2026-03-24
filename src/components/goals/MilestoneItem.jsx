import Button from '../ui/Button'

export default function MilestoneItem({ milestone, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-none">

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
          milestone.done
            ? 'bg-green-500 border-green-500 text-black'
            : 'border-zinc-600 hover:border-green-500'
        }`}
      >
        {milestone.done && <span className="text-xs font-bold">✓</span>}
      </button>

      {/* Text */}
      <span className={`flex-1 text-sm ${
        milestone.done ? 'line-through text-zinc-600' : 'text-zinc-300'
      }`}>
        {milestone.text}
      </span>

      {/* Done date */}
      {milestone.doneAt && (
        <span className="text-xs text-zinc-600">{milestone.doneAt}</span>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="text-zinc-700 hover:text-red-400 transition text-xs"
      >
        ✕
      </button>

    </div>
  )
}