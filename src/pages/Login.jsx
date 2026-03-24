import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginWithGoogle } from '../firebase'

export default function Login() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center px-6">

        {/* Logo */}
        <h1 className="text-6xl font-black tracking-widest text-white mb-2">
          DAILY LIFE
        </h1>
        <p className="text-orange-500 text-sm tracking-widest uppercase mb-2">
          Personal Development
        </p>
        <p className="text-zinc-500 text-sm mb-12">
          Track habits. Hit goals. Reflect daily.
        </p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 bg-white hover:bg-zinc-100 text-black font-semibold px-8 py-3 rounded-xl transition mx-auto"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-zinc-600 text-xs mt-8">
          Your data is private and tied to your account only.
        </p>
      </div>
    </div>
  )
}