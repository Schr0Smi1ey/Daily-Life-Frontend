import { useAuth } from '../../context/AuthContext'

export default function DailyGreeting() {
  const { user } = useAuth()
  const hour = new Date().getHours()

  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
                'Good evening'

  const name = user?.displayName?.split(' ')[0] || 'there'

  return (
    <div className="mb-2">
      <h2 className="text-3xl font-black text-white tracking-wide">
        {greeting}, <span className="text-orange-500">{name}.</span>
      </h2>
      <p className="text-zinc-500 text-sm mt-1">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        })}
      </p>
    </div>
  )
}