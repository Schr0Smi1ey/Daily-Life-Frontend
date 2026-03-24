import { useEffect } from 'react'
import { checkAchievements } from '../utils/checkAchievements'

export default function useAchievementChecker({
  habits, goals, entries, unlocked, unlock
}) {
  useEffect(() => {
    if (!habits?.length && !goals?.length && !entries?.length) return

    const toUnlock  = checkAchievements({ habits, goals, entries })
    const unlockedKeys = unlocked.map(a => a.badgeKey)

    // Only unlock badges that aren't already unlocked
    toUnlock.forEach(key => {
      if (!unlockedKeys.includes(key)) {
        unlock(key)
      }
    })
  }, [habits, goals, entries])
}