import { useState, useEffect } from 'react'
import api from '../api'

export default function useProgress() {
  const [weekly,  setWeekly]  = useState(null)
  const [streaks, setStreaks] = useState([])
  const [report,  setReport]  = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchAll() {
    try {
      const [w, s, r] = await Promise.all([
        api.get('/api/progress/weekly'),
        api.get('/api/progress/streaks'),
        api.get('/api/progress/report'),
      ])
      setWeekly(w.data)
      setStreaks(s.data)
      setReport(r.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  return { weekly, streaks, report, loading, refetch: fetchAll }
}