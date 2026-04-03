import { motion } from "framer-motion";
import { Award, TrendingUp, Target, Sparkles } from "lucide-react";

export default function WeeklyReportCard({ report }) {
  if (!report) return null;

  const { bestHabit, worstDay, overallPct } = report;

  const formatDay = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const grade =
    overallPct >= 90
      ? {
          label: "Excellent",
          tone: "success",
          icon: <Award className="h-5 w-5" />,
          emoji: "🏆",
        }
      : overallPct >= 70
        ? {
            label: "Good",
            tone: "primary",
            icon: <TrendingUp className="h-5 w-5" />,
            emoji: "💪",
          }
        : overallPct >= 50
          ? {
              label: "Average",
              tone: "warning",
              icon: <Sparkles className="h-5 w-5" />,
              emoji: "📈",
            }
          : {
              label: "Keep Going",
              tone: "danger",
              icon: <Target className="h-5 w-5" />,
              emoji: "🎯",
            };

  const toneClasses = {
    success: {
      text: "text-green-500 dark:text-green-400",
      pill: "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
      glow: "rgba(34,197,94,0.18)",
    },
    primary: {
      text: "text-[var(--color-primary)]",
      pill: "border-[rgba(var(--color-primary-rgb),0.2)] bg-[rgba(var(--color-primary-rgb),0.10)] text-[var(--color-primary)]",
      glow: "rgba(var(--color-primary-rgb),0.18)",
    },
    warning: {
      text: "text-yellow-600 dark:text-yellow-400",
      pill: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      glow: "rgba(234,179,8,0.18)",
    },
    danger: {
      text: "text-red-600 dark:text-red-400",
      pill: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      glow: "rgba(239,68,68,0.18)",
    },
  };

  const tone = toneClasses[grade.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)] md:p-6"
    >
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: tone.glow }}
      />

      <div className="relative z-10">
        {/* Hero */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              This Week
            </p>

            <div className="flex items-end gap-3">
              <motion.p
                initial={{ opacity: 0.9, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-6xl"
              >
                {overallPct}%
              </motion.p>

              <div
                className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tone.pill}`}
              >
                {grade.icon}
                {grade.label}
              </div>
            </div>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
              A quick snapshot of how your week performed across consistency,
              completion, and momentum.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-200/80 bg-zinc-50 text-3xl dark:border-white/10 dark:bg-white/[0.03]">
            {grade.emoji}
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Best Habit
            </p>

            <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              {bestHabit?.name || "—"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {bestHabit?.rate > 0
                ? `${bestHabit.rate}/7 days completed`
                : "No standout habit yet"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Weakest Day
            </p>

            <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              {formatDay(worstDay?.date)}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {worstDay
                ? `${worstDay.completed}/${worstDay.total} habits completed`
                : "No weak day recorded"}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
