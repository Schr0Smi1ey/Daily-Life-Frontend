import { useNavigate } from 'react-router-dom'
import ProgressBar from '../ui/ProgressBar'
import EmptyState from '../ui/EmptyState'

export default function ActiveGoalsSummary({ goals = [] }) {
  const navigate  = useNavigate()
  const active    = goals.filter(g => g.status === 'active').slice(0, 3)

  return (
    <div
      className="bg-zinc-900 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-orange-500/30 transition"
      onClick={() => navigate('/goals')}
    >
      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
        Active Goals
      </p>

      {active.length === 0 ? (
        <p className="text-zinc-600 text-sm text-center py-4">
          No active goals yet
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {active.map(goal => {
            const total    = goal.milestones?.length || 0
            const done     = goal.milestones?.filter(m => m.done).length || 0
            const progress = total ? Math.round(done / total * 100) : 0

            return (
              <div key={goal._id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-white font-medium truncate pr-2">
                    {goal.title}
                  </span>
                  <span className="text-xs font-bold text-orange-500 flex-shrink-0">
                    {progress}%
                  </span>
                </div>
                <ProgressBar value={progress} />
              </div>
            )
          })}
          {goals.filter(g => g.status === 'active').length > 3 && (
            <p className="text-xs text-zinc-600 text-center">
              +{goals.filter(g => g.status === 'active').length - 3} more goals
            </p>
          )}
        </div>
      )}
    </div>
  )
}