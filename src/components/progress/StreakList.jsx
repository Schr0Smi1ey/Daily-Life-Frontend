import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function StreakList({ streaks = [] }) {
  if (!streaks.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/50 px-4 text-center dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No streak data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {streaks.map((s, index) => (
        <motion.div
          key={s.id || s.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04]">
              <Flame
                className="h-4 w-4"
                style={{ color: "var(--color-primary)" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
                {s.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">Consistency streak</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Current
                </p>
                <p
                  className="mt-1 text-lg font-semibold tracking-tight"
                  style={{ color: "var(--color-primary)" }}
                >
                  {s.current > 0 ? s.current : "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Best
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {s.best || "—"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
