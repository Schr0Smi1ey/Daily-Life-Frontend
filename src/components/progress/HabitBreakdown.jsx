import { motion } from "framer-motion";
import ProgressBar from "../ui/ProgressBar";

export default function HabitBreakdown({ habits = [] }) {
  if (!habits.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/50 px-4 text-center dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No habits to report yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((h, index) => (
        <motion.div
          key={h.id || h.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
                {h.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">Weekly completion</p>
            </div>

            <div className="shrink-0 text-right">
              <p
                className="text-lg font-semibold tracking-tight"
                style={{ color: "var(--color-primary)" }}
              >
                {h.rate}%
              </p>
            </div>
          </div>

          <ProgressBar value={h.rate} color="primary" />
        </motion.div>
      ))}
    </div>
  );
}
