import { useState, useEffect } from 'react'
import api from '../api'

export default function useAchievements() {
  const [unlocked,    setUnlocked]    = useState([])
  const [newBadgeKey, setNewBadgeKey] = useState(null)

  async function fetchAchievements() {
    try {
      const res = await api.get('/api/achievements')
      setUnlocked(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function unlock(badgeKey) {
    try {
      const res = await api.post('/api/achievements', { badgeKey })
      setUnlocked(prev => {
        const exists = prev.find(a => a.badgeKey === badgeKey)
        if (exists) return prev
        setNewBadgeKey(badgeKey)    // ← trigger toast
        return [...prev, res.data]
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchAchievements() }, [])

  return {
    unlocked, unlock, newBadgeKey,
    clearNewBadge: () => setNewBadgeKey(null),
    refetch: fetchAchievements
  }
}