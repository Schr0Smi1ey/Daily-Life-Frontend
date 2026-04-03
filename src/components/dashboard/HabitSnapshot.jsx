import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProgressBar from "../ui/ProgressBar";
import ConfettiBlast from "../ui/ConfettiBlast";

function SnapshotPill({ children, success = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
        success
          ? "bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-300"
          : "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400"
      }`}
    >
      {children}
    </span>
  );
}

export default function HabitSnapshot({ habits = [] }) {
  const navigate = useNavigate();

  const { total, completed, allDone, pct, helperText } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const totalHabits = habits.length;
    const doneCount = habits.filter((habit) =>
      habit.checkins?.some((checkin) => checkin.date === today),
    ).length;
    const everyDone = totalHabits > 0 && doneCount === totalHabits;
    const percent = totalHabits
      ? Math.round((doneCount / totalHabits) * 100)
      : 0;

    let text = "No habits yet — add your first one";
    if (totalHabits > 0) {
      text =
        doneCount === totalHabits
          ? "Everything is complete for today"
          : `${totalHabits - doneCount} remaining today`;
    }

    return {
      total: totalHabits,
      completed: doneCount,
      allDone: everyDone,
      pct: percent,
      helperText: text,
    };
  }, [habits]);

  return (
    <>
      <ConfettiBlast trigger={allDone} />

      <motion.button
        type="button"
        onClick={() => navigate("/habits")}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        className="group relative w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-300 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-primary)]/10 blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="relative">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
                Today&apos;s habits
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Track your momentum for the day.
              </p>
            </div>

            {allDone ? (
              <SnapshotPill success>All done! 🎉</SnapshotPill>
            ) : (
              <SnapshotPill>{pct}% complete</SnapshotPill>
            )}
          </div>

          <div className="mb-4 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              {completed}
            </span>
            <span className="pb-1 text-xl font-medium text-zinc-400 dark:text-zinc-500">
              /{total}
            </span>
          </div>

          <ProgressBar
            value={pct}
            color={allDone ? "green" : "primary"}
            height="h-2.5"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {helperText}
            </p>
            <span className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-300">
              Open habits →
            </span>
          </div>
        </div>
      </motion.button>
    </>
  );
}
