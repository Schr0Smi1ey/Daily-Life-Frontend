import HabitItem from './HabitItem'
import EmptyState from '../ui/EmptyState'

export default function HabitGroup({ title, icon, habits, onCheckin, onUndoCheckin, onDelete }) {
  if (!habits.length) return null

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
          {title}
        </h2>
        <span className="text-xs text-zinc-700 ml-1">({habits.length})</span>
      </div>
      <div className="flex flex-col gap-2">
        {habits.map(habit => (
          <HabitItem
            key={habit._id}
            habit={habit}
            onCheckin={onCheckin}
            onUndoCheckin={onUndoCheckin}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}