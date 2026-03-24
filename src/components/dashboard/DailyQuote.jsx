import { QUOTES } from '../../constants/quotes'

export default function DailyQuote() {
  // Rotate by day of year so it changes daily
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  const quote = QUOTES[dayOfYear % QUOTES.length]

  return (
    <div className="border-l-4 border-orange-500 bg-orange-500/5 rounded-r-xl px-5 py-4 mb-8">
      <p className="text-zinc-300 text-sm italic leading-relaxed">
        "{quote.text}"
      </p>
      <p className="text-orange-500 text-xs mt-2 font-semibold">
        — {quote.author}
      </p>
    </div>
  )
}