export default function GoalStatusTabs({ active, onChange, counts }) {
  const tabs = [
    { value: 'all',       label: 'All'       },
    { value: 'active',    label: 'Active'    },
    { value: 'paused',    label: 'Paused'    },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            active === tab.value
              ? 'bg-orange-500 text-black'
              : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          {tab.label}
          {counts[tab.value] > 0 && (
            <span className="ml-1.5 opacity-70">({counts[tab.value]})</span>
          )}
        </button>
      ))}
    </div>
  )
}