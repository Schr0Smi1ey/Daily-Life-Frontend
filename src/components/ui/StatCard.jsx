export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div
      className={`rounded-xl p-5 border ${
        accent
          ? 'border-[var(--color-primary)] text-black'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10'
      }`}
      style={accent ? { backgroundColor: 'var(--color-primary)' } : {}}
    >
      <p className={`text-xs tracking-widest uppercase mb-2 ${
        accent ? 'text-black/60' : 'text-zinc-500'
      }`}>
        {label}
      </p>
      <p className={`text-4xl font-black leading-none ${
        accent ? 'text-black' : 'text-zinc-900 dark:text-white'
      }`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-1 ${
          accent ? 'text-black/50' : 'text-zinc-500'
        }`}>
          {sub}
        </p>
      )}
    </div>
  )
}