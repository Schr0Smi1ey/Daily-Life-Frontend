import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth }  from './context/AuthContext'
import { ThemeProvider }          from './context/ThemeContext'
import ProtectedRoute             from './components/ProtectedRoute'
import AppShell                   from './components/layout/AppShell'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Habits    from './pages/Habits'
import Goals     from './pages/Goals'
import Journal   from './pages/Journal'
import Progress  from './pages/Progress'
import Profile   from './pages/Profile'

function ThemedApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route index            element={<Dashboard />} />
          <Route path="habits"    element={<Habits />}    />
          <Route path="goals"     element={<Goals />}     />
          <Route path="journal"   element={<Journal />}   />
          <Route path="progress"  element={<Progress />}  />
          <Route path="profile"   element={<Profile />}   />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function AppWithTheme() {
  return (
    <AuthProvider>
      <PrefsLoader />
    </AuthProvider>
  )
}

function PrefsLoader() {
  const { user, loading } = useAuth()
  const [prefs, setPrefs] = useState(null)
  const [prefsLoaded, setPrefsLoaded] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) { setPrefsLoaded(true); return }

    import('./api').then(({ default: api }) => {
      api.get('/api/users/me')
        .then(res => setPrefs(res.data?.preferences || null))
        .catch(() => {})
        .finally(() => setPrefsLoaded(true))
    })
  }, [user, loading])

  if (!prefsLoaded) return null

  return (
    <ThemeProvider initialPrefs={prefs}>
      <ThemedApp />
    </ThemeProvider>
  )
}

// Need useState and useEffect here
import { useState, useEffect } from 'react'
export default AppWithTheme