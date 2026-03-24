export default function ConsistencyScore({ score = 0 }) {
  const color =
    score >= 80 ? 'text-green-400'  :
    score >= 60 ? 'text-orange-400' :
    score >= 40 ? 'text-yellow-400' :
                  'text-red-400'

  const message =
    score >= 80 ? 'Outstanding! Keep it up.' :
    score >= 60 ? 'Good progress. Stay consistent.' :
    score >= 40 ? 'Getting there. Push a bit harder.' :
                  'Let\'s build the habit. Start small.'

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
          Consistency Score
        </p>
        <p className={`text-6xl font-black leading-none ${color}`}>
          {score}%
        </p>
        <p className="text-zinc-500 text-xs mt-2">{message}</p>
      </div>
      {/* Ring */}
      <div className="ml-auto flex-shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="34"
            fill="none" stroke="#27272a"
            strokeWidth="8"
          />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke={score >= 80 ? '#4ade80' : score >= 60 ? '#f97316' : score >= 40 ? '#facc15' : '#f87171'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - score / 100)}`}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <text
            x="40" y="45"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {score}%
          </text>
        </svg>
      </div>
    </div>
  )
}