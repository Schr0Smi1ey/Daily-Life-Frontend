import { useNavigate } from 'react-router-dom'
import ProgressBar from '../ui/ProgressBar'
import ConfettiBlast from '../ui/ConfettiBlast'

export default function HabitSnapshot({ habits = [] }) {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  const total     = habits.length
  const completed = habits.filter(h => h.checkins?.some(c => c.date === today)).length
  const allDone   = total > 0 && completed === total
  const pct       = total ? Math.round(completed / total * 100) : 0

  return (
    <>
      <ConfettiBlast trigger={allDone} />

      <div
        className="bg-zinc-900 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-orange-500/30 transition"
        onClick={() => navigate('/habits')}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Today's Habits
          </p>
          {allDone && (
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              All done! 🎉
            </span>
          )}
        </div>

        <p className="text-4xl font-black text-white mb-3">
          {completed}
          <span className="text-zinc-600 text-2xl">/{total}</span>
        </p>

        <ProgressBar
          value={pct}
          color={allDone ? 'green' : 'orange'}
          height="h-2"
        />

        <p className="text-zinc-600 text-xs mt-2">
          {total === 0
            ? 'No habits yet — add your first one'
            : `${total - completed} remaining today`
          }
        </p>
      </div>
    </>
  )
}