export default function ProgressBar({ value = 0, color = 'orange', height = 'h-1.5' }) {
  const colors = {
    orange: 'bg-orange-500',
    green:  'bg-green-500',
    blue:   'bg-blue-500',
  }

  return (
    <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${height}`}>
      <div
        className={`${colors[color]} ${height} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}