import { useState, useEffect } from 'react'
import api from '../api'
import { updateFirebaseProfile, uploadAvatar, logout } from '../firebase'

export default function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState(null)

  async function fetchProfile() {
    try {
      const res = await api.get('/api/users/me')
      setProfile(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(data) {
    try {
      setSaving(true)
      setError(null)
      const res = await api.patch('/api/users/me', data)
      setProfile(res.data)

      // Keep Firebase Auth in sync
      if (data.displayName || data.photoURL) {
        await updateFirebaseProfile(data.displayName, data.photoURL)
      }

      return res.data
    } catch (err) {
      setError('Failed to save. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function uploadProfileAvatar(file) {
    try {
      setSaving(true)
      setError(null)

      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('File must be an image')
        return
      }

      // Upload to ImgBB → get URL → save to MongoDB
      const url = await uploadAvatar(file)
      await updateProfile({ photoURL: url })
      return url
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function exportData() {
    try {
      const res  = await api.get('/api/users/export')
      const blob = new Blob(
        [JSON.stringify(res.data, null, 2)],
        { type: 'application/json' }
      )
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href     = url
      link.download = `dailylife-export-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Export failed. Please try again.')
      console.error(err)
    }
  }

  async function deleteAccount() {
    try {
      await api.delete('/api/users/me')
      await logout()
    } catch (err) {
      setError('Delete failed. Please try again.')
      console.error(err)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  return {
    profile, loading, saving, error,
    updateProfile, uploadProfileAvatar,
    exportData, deleteAccount,
    refetch: fetchProfile
  }
}