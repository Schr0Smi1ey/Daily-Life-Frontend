export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`rounded-xl p-5 border ${
      accent
        ? 'bg-orange-500 border-orange-500'
        : 'bg-zinc-900 border-white/10'
    }`}>
      <p className={`text-xs tracking-widest uppercase mb-2 ${
        accent ? 'text-black/60' : 'text-zinc-500'
      }`}>
        {label}
      </p>
      <p className={`text-4xl font-black leading-none ${
        accent ? 'text-black' : 'text-white'
      }`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-1 ${
          accent ? 'text-black/50' : 'text-zinc-600'
        }`}>
          {sub}
        </p>
      )}
    </div>
  )
}