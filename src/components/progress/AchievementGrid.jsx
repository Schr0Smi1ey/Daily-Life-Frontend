import { BADGES } from '../../constants/badges'

export default function AchievementGrid({ unlocked = [] }) {
  const unlockedKeys = unlocked.map(a => a.badgeKey)

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {BADGES.map(badge => {
        const achievement = unlocked.find(a => a.badgeKey === badge.key)
        const isUnlocked  = !!achievement

        return (
          <div
            key={badge.key}
            className={`rounded-2xl p-4 border text-center transition ${
              isUnlocked
                ? 'bg-zinc-900 border-orange-500/30'
                : 'bg-zinc-900/40 border-white/5 opacity-40'
            }`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <p className={`text-xs font-bold mb-1 ${
              isUnlocked ? 'text-white' : 'text-zinc-500'
            }`}>
              {badge.label}
            </p>
            <p className="text-xs text-zinc-600 leading-snug mb-2">
              {badge.desc}
            </p>
            {isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-orange-500/70">
                {formatDate(achievement.unlockedAt)}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}