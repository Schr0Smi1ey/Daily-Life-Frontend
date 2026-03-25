import { useState, useRef, useEffect } from 'react'
import { useNavigate }   from 'react-router-dom'
import PageHeader        from '../components/layout/PageHeader'
import Button            from '../components/ui/Button'
import Spinner           from '../components/ui/Spinner'
import { useTheme }      from '../context/ThemeContext'
import { useAuth }       from '../context/AuthContext'
import useProfile        from '../hooks/useProfile'
import defaultAvatar     from '../assets/avatar.jpg'

const THEME_OPTIONS = [
  { value: 'light',  label: '☀️ Light'  },
  { value: 'dark',   label: '🌙 Dark'   },
  { value: 'system', label: '💻 System' },
]

const VIEW_OPTIONS = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'habits',    label: 'Habits'    },
  { value: 'goals',     label: 'Goals'     },
  { value: 'journal',   label: 'Journal'   },
]

const WEEK_OPTIONS = [
  { value: 'sunday',   label: 'Sunday'   },
  { value: 'monday',   label: 'Monday'   },
  { value: 'saturday', label: 'Saturday' },
]

const COLOR_PRESETS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
  '#ef4444', // red
  '#eab308', // yellow
  '#ec4899', // pink
  '#14b8a6', // teal
]

export default function Profile() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const fileRef     = useRef()

  const {
    theme, setTheme,
    primaryColor, setPrimaryColor
  } = useTheme()

  const {
    profile, loading, saving, error,
    updateProfile, uploadProfileAvatar,
    exportData, deleteAccount
  } = useProfile()

  const [name,        setName]        = useState('')
  const [bio,         setBio]         = useState('')
  const [saved,       setSaved]       = useState(false)
  const [showDelete,  setShowDelete]  = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [previewUrl,  setPreviewUrl]  = useState(null)

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.displayName || '')
      setBio(profile.bio          || '')
    }
  }, [profile])

  const handleSaveProfile = async () => {
    await updateProfile({ displayName: name, bio })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSavePrefs = async (newPrefs) => {
    await updateProfile({
      preferences: {
        ...profile?.preferences,
        ...newPrefs
      }
    })
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)

    await uploadProfileAvatar(file)
    setPreviewUrl(null) // use the saved URL from profile
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return
    await deleteAccount()
    navigate('/login')
  }

  if (loading) return <Spinner />

  const prefs  = profile?.preferences || {}
  const avatar = previewUrl || profile?.photoURL || user?.photoURL || defaultAvatar

  return (
    <div className="max-w-2xl">
      <PageHeader title="PROFILE" subtitle="Manage your account and preferences." />

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{error}</p>
        </div>
      )}

      {/* ── Avatar ─────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
          Profile Picture
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
              onError={e => { e.target.src = defaultAvatar }}
            />
            {saving && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <Button
              size="sm"
              onClick={() => fileRef.current.click()}
              disabled={saving}
            >
              {saving ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <p className="text-zinc-600 text-xs mt-2">
              JPG, PNG — max 5MB
            </p>
            <p className="text-zinc-700 text-xs mt-1">
              Hosted via ImgBB
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* ── Profile Info ───────────────────────────────── */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
          Profile Info
        </h2>

        <div className="mb-4">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            Display Name
          </label>
          <input
  className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition"
  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
  value={name}
  onChange={e => setName(e.target.value)}
  placeholder="Your name"
/>
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            Email
          </label>
          <input
            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-500 text-sm cursor-not-allowed"
            value={user?.email || ''}
            disabled
          />
          <p className="text-zinc-700 text-xs mt-1">
            Managed by Google
          </p>
        </div>

<div className="mb-6">
  <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
    Bio
  </label>
  <textarea
    className="w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
    placeholder="A short description about yourself..."
    rows={3}
    value={bio}
    onChange={e => setBio(e.target.value)}
  />
</div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
          {saved && (
            <span className="text-green-400 text-xs font-semibold animate-pulse">
              ✓ Saved!
            </span>
          )}
        </div>
      </div>

      {/* ── Preferences ────────────────────────────────── */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-5">
          Preferences
        </h2>

        {/* Theme */}
        <div className="mb-6">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            Theme
          </label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => {
                    setTheme(t.value)
                    handleSavePrefs({ theme: t.value })
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition ${
                    theme === t.value
                    ? 'text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                style={
                    theme === t.value
                    ? { backgroundColor: 'var(--color-primary)' }
                    : {}
                }
                >
                {t.label}
                </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div className="mb-6">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-3">
            Primary Color
          </label>
          {/* Presets */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {COLOR_PRESETS.map(c => (
              <button
                key={c}
                onClick={() => {
                  setPrimaryColor(c)
                  handleSavePrefs({ primaryColor: c })
                }}
                className="w-8 h-8 rounded-full border-2 transition hover:scale-110"
                style={{
                  background:  c,
                  borderColor: primaryColor === c ? 'white' : 'transparent'
                }}
              />
            ))}
          </div>
          {/* Full color picker */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              onBlur={e => handleSavePrefs({ primaryColor: e.target.value })}
              className="w-10 h-10 rounded-xl border border-white/10 bg-zinc-800 cursor-pointer"
            />
            <span className="text-zinc-400 text-sm font-mono">{primaryColor}</span>
            <span className="text-zinc-600 text-xs">Custom color</span>
          </div>
        </div>

        {/* Default View */}
        <div className="mb-6">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            Default View after Login
          </label>
          <div className="flex gap-2">
            {VIEW_OPTIONS.map(v => (
              <button
                key={v.value}
                onClick={() => handleSavePrefs({ defaultView: v.value })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                    prefs.defaultView === v.value
                    ? 'text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                style={
                    prefs.defaultView === v.value
                    ? { backgroundColor: 'var(--color-primary)' }
                    : {}
                }
                >
                {v.label}</button>
            ))}
          </div>
        </div>

        {/* Week Start */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            Week Starts On
          </label>
          <div className="flex gap-2">
            {WEEK_OPTIONS.map(w => (
              <button
  key={w.value}
  onClick={() => handleSavePrefs({ weekStart: w.value })}
  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
    prefs.weekStart === w.value
      ? 'text-black'
      : 'bg-zinc-800 text-zinc-400 hover:text-white'
  }`}
  style={
    prefs.weekStart === w.value
      ? { backgroundColor: 'var(--color-primary)' }
      : {}
  }
>
  {w.label}
</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Data Export ────────────────────────────────── */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
          Export Data
        </h2>
        <p className="text-zinc-500 text-sm mb-4">
          Download all your habits, goals, journal entries and achievements as a JSON file.
        </p>
        <Button variant="ghost" onClick={exportData}>
          ↓ Download My Data
        </Button>
      </div>

      {/* ── Danger Zone ────────────────────────────────── */}
      <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6 mb-10">
        <h2 className="text-xs font-bold tracking-widest uppercase text-red-400 mb-2">
          Danger Zone
        </h2>
        <p className="text-zinc-500 text-sm mb-4">
          Permanently delete your account and all data. This cannot be undone.
        </p>

        {!showDelete ? (
          <Button variant="danger" onClick={() => setShowDelete(true)}>
            Delete Account
          </Button>
        ) : (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm mb-3 font-semibold">
              Type <span className="font-mono bg-red-500/10 px-1 rounded">DELETE</span> to confirm:
            </p>
            <input
              className="w-full bg-zinc-800 border border-red-500/30 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-red-500 transition mb-3"
              placeholder="Type DELETE"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={deleteInput !== 'DELETE' || saving}
              >
                Confirm Delete
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setShowDelete(false); setDeleteInput('') }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}