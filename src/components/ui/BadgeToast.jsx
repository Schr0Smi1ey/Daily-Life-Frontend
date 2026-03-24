import { useEffect, useState } from 'react'
import { BADGES } from '../../constants/badges'

export default function BadgeToast({ newBadgeKey, onDone }) {
  const [visible, setVisible] = useState(false)
  const badge = BADGES.find(b => b.key === newBadgeKey)

  useEffect(() => {
    if (!newBadgeKey) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 3500)
    return () => clearTimeout(t)
  }, [newBadgeKey])

  if (!badge) return null

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-zinc-900 border border-orange-500/40 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-xl">
        <div className="text-4xl">{badge.icon}</div>
        <div>
          <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-0.5">
            Badge Unlocked!
          </p>
          <p className="text-white font-bold text-sm">{badge.label}</p>
          <p className="text-zinc-500 text-xs">{badge.desc}</p>
        </div>
      </div>
    </div>
  )
}