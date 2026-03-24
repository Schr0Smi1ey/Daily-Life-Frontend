import { useState, useEffect } from 'react'
import api from '../api'

export default function useGoals() {
  const [goals, setGoals]     = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchGoals() {
    try {
      const res = await api.get('/api/goals')
      setGoals(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function createGoal(data) {
    const res = await api.post('/api/goals', data)
    setGoals(prev => [res.data, ...prev])
    return res.data
  }

  async function updateGoal(id, data) {
    const res = await api.patch(`/api/goals/${id}`, data)
    setGoals(prev => prev.map(g => g._id === id ? res.data : g))
    return res.data
  }

  async function deleteGoal(id) {
    await api.delete(`/api/goals/${id}`)
    setGoals(prev => prev.filter(g => g._id !== id))
  }

  async function addMilestone(goalId, text) {
    const res = await api.post(`/api/goals/${goalId}/milestones`, { text })
    setGoals(prev => prev.map(g => g._id === goalId ? res.data : g))
    return res.data
  }

  async function toggleMilestone(goalId, msId) {
    const res = await api.patch(`/api/goals/${goalId}/milestones/${msId}`)
    setGoals(prev => prev.map(g => g._id === goalId ? res.data : g))
    return res.data
  }

  async function deleteMilestone(goalId, msId) {
    const res = await api.delete(`/api/goals/${goalId}/milestones/${msId}`)
    setGoals(prev => prev.map(g => g._id === goalId ? res.data : g))
  }

  useEffect(() => { fetchGoals() }, [])

  return {
    goals, loading,
    createGoal, updateGoal, deleteGoal,
    addMilestone, toggleMilestone, deleteMilestone,
    refetch: fetchGoals
  }
}