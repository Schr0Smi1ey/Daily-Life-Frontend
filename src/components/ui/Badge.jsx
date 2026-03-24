export default function Badge({ category }) {
  const styles = {
    health:       'bg-green-500/15 text-green-400',
    fitness:      'bg-red-500/15 text-red-400',
    learning:     'bg-blue-500/15 text-blue-400',
    mindfulness:  'bg-purple-500/15 text-purple-400',
    productivity: 'bg-orange-500/15 text-orange-400',
    general:      'bg-zinc-700 text-zinc-400',
  }

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[category] || styles.general}`}>
      {category}
    </span>
  )
}