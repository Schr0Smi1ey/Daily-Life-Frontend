import { useNavigate } from 'react-router-dom'

export default function QuickAdd({ onNewJournal }) {
  const navigate = useNavigate()

  const actions = [
    { label: '+ Add Habit',      icon: '◎', onClick: () => navigate('/habits')  },
    { label: '+ Set Goal',       icon: '◈', onClick: () => navigate('/goals')   },
    { label: '+ Journal Entry',  icon: '✎', onClick: onNewJournal               },
    { label: '↗ View Progress',  icon: '↗', onClick: () => navigate('/progress') },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map(action => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex items-center gap-2 bg-zinc-900 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 rounded-xl px-4 py-3 text-sm text-zinc-400 hover:text-white transition"
        >
          <span className="text-base">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  )
}