import { useState, useEffect } from 'react'
import api from '../api'

export default function useJournal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchEntries() {
    try {
      const res = await api.get('/api/journal')
      setEntries(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function createEntry(data) {
    const res = await api.post('/api/journal', data)
    setEntries(prev => [res.data, ...prev])
    return res.data
  }

  async function updateEntry(id, data) {
    const res = await api.patch(`/api/journal/${id}`, data)
    setEntries(prev => prev.map(e => e._id === id ? res.data : e))
    return res.data
  }

  async function deleteEntry(id) {
    await api.delete(`/api/journal/${id}`)
    setEntries(prev => prev.filter(e => e._id !== id))
  }

  useEffect(() => { fetchEntries() }, [])

  return {
    entries, loading,
    createEntry, updateEntry, deleteEntry,
    refetch: fetchEntries
  }
}