import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2">
      <p className="text-zinc-400 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-bold">{payload[0].value}%</p>
    </div>
  )
}

export default function WeeklyChart({ days = [] }) {
  const data = days.map(d => ({
    day: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
    pct: d.pct
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
          tickFormatter={v => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.pct >= 80 ? '#f97316' : entry.pct >= 50 ? 'rgba(249,115,22,0.5)' : 'rgba(249,115,22,0.2)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}