import { motion } from "framer-motion";

function getScoreMeta(score) {
  if (score >= 80)
    return {
      color: "text-emerald-400",
      stroke: "#4ade80",
      message: "Outstanding! Keep it up.",
    };
  if (score >= 60)
    return {
      color: "text-orange-400",
      stroke: "#f97316",
      message: "Good progress. Stay consistent.",
    };
  if (score >= 40)
    return {
      color: "text-yellow-400",
      stroke: "#facc15",
      message: "Getting there. Push a bit harder.",
    };
  return {
    color: "text-red-400",
    stroke: "#f87171",
    message: "Let’s build the habit. Start small.",
  };
}

export default function ConsistencyScore({ score = 0 }) {
  const safeScore = Math.min(100, Math.max(0, score));
  const { color, stroke, message } = getScoreMeta(safeScore);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeScore / 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-7">
      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--color-primary)]/10 blur-3xl opacity-70" />
      </div>

      <div className="relative flex items-center gap-6">
        {/* text side */}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
            Consistency score
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span
              className={`text-5xl md:text-6xl font-semibold tracking-tight ${color}`}
            >
              {safeScore}
            </span>
            <span className="pb-1 text-lg font-medium text-zinc-400">%</span>
          </div>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
            {message}
          </p>
        </div>

        {/* ring */}
        <div className="ml-auto shrink-0">
          <svg width="88" height="88" viewBox="0 0 80 80">
            {/* background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />

            {/* animated progress */}
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              transform="rotate(-90 40 40)"
            />

            {/* center text */}
            <text
              x="40"
              y="45"
              textAnchor="middle"
              className="fill-zinc-800 dark:fill-white text-xs font-semibold"
            >
              {safeScore}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
