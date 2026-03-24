import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import Login    from './pages/Login'
import Dashboard from './pages/Dashboard'
import Habits   from './pages/Habits'
import Goals    from './pages/Goals'
import Journal  from './pages/Journal'
import Progress from './pages/Progress'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }>
            <Route index        element={<Dashboard />} />
            <Route path="habits"   element={<Habits />}    />
            <Route path="goals"    element={<Goals />}     />
            <Route path="journal"  element={<Journal />}   />
            <Route path="progress" element={<Progress />}  />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}