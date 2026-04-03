import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const value = payload[0].value ?? 0;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
        {value}%
      </p>
    </div>
  );
};

export default function WeeklyChart({ days = [] }) {
  const data = days.map((d) => ({
    day: new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    pct: d.pct ?? 0,
  }));

  if (!data.length) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/50 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        No weekly data yet
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={30}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(113,113,122,0.16)"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "#71717a", fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(var(--color-primary-rgb),0.08)" }}
          />

          <Bar dataKey="pct" radius={[10, 10, 4, 4]} animationDuration={500}>
            {data.map((entry, i) => {
              let opacity = 0.2;
              if (entry.pct >= 80) opacity = 1;
              else if (entry.pct >= 50) opacity = 0.55;

              return (
                <Cell
                  key={i}
                  fill={`rgba(var(--color-primary-rgb),${opacity})`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
