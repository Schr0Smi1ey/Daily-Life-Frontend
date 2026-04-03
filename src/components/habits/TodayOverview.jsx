import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TodayItem from "./TodayItem";
import EmptyState from "../ui/EmptyState";
import ProgressBar from "../ui/ProgressBar";

function OverviewHeader({ doneItems, totalItems, allDone, pct }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
          Today&apos;s overview
        </p>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-4xl">
            {doneItems}
          </span>
          <span className="pb-1 text-base font-medium text-zinc-400 dark:text-zinc-500">
            /{totalItems} complete
          </span>
        </div>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          A live snapshot of today&apos;s unfinished habits and goals.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
          {pct}% complete
        </div>

        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{
                background: "rgba(var(--color-primary-rgb), 0.12)",
                color: "var(--color-primary)",
              }}
            >
              All done! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CompletedState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-zinc-200 bg-zinc-50/70 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="mb-3 text-4xl">🏆</div>
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
        Everything done for today
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Nice work. You showed up for all of it.
      </p>
    </motion.div>
  );
}

function TodayItemsList({
  incompleteHabits,
  incompleteGoals,
  categories,
  onCompleteHabit,
  onUndoHabit,
  onCompleteGoal,
  onUndoGoal,
  onDeleteHabit,
}) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {incompleteHabits.map((habit, index) => (
          <motion.div
            key={habit._id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: index * 0.025 }}
          >
            <TodayItem
              item={habit}
              type="habit"
              categories={categories}
              onComplete={onCompleteHabit}
              onUndoComplete={onUndoHabit}
              onDelete={onDeleteHabit}
            />
          </motion.div>
        ))}

        {incompleteGoals.map((goal, index) => (
          <motion.div
            key={goal._id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.2,
              delay: incompleteHabits.length * 0.025 + index * 0.025,
            }}
          >
            <TodayItem
              item={goal}
              type="goal"
              categories={categories}
              onComplete={onCompleteGoal}
              onUndoComplete={onUndoGoal}
              onDelete={() => {}}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function TodayOverview({
  habits,
  goals,
  onCompleteHabit,
  onUndoHabit,
  onCompleteGoal,
  onUndoGoal,
  onDeleteHabit,
  categories = [],
}) {
  const today = new Date().toISOString().split("T")[0];

  const {
    incompleteHabits,
    incompleteGoals,
    totalItems,
    doneItems,
    pct,
    allDone,
  } = useMemo(() => {
    const pendingHabits = habits.filter(
      (habit) => !habit.checkins?.some((checkin) => checkin.date === today),
    );

    const pendingGoals = goals.filter((goal) => !goal.doneToday);

    const total = habits.length + goals.length;
    const done =
      habits.length -
      pendingHabits.length +
      (goals.length - pendingGoals.length);
    const progress = total ? Math.round((done / total) * 100) : 0;

    return {
      incompleteHabits: pendingHabits,
      incompleteGoals: pendingGoals,
      totalItems: total,
      doneItems: done,
      pct: progress,
      allDone: total > 0 && done === total,
    };
  }, [habits, goals, today]);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6">
      <OverviewHeader
        doneItems={doneItems}
        totalItems={totalItems}
        allDone={allDone}
        pct={pct}
      />

      <div className="mt-5">
        <ProgressBar
          value={pct}
          color={allDone ? "green" : "primary"}
          height="h-2.5"
          animated
        />
      </div>

      {totalItems === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon="✓"
            title="Nothing scheduled yet"
            message="No habits or goals yet. Add some to start building momentum."
          />
        </div>
      ) : incompleteHabits.length === 0 && incompleteGoals.length === 0 ? (
        <div className="mt-5">
          <CompletedState />
        </div>
      ) : (
        <TodayItemsList
          incompleteHabits={incompleteHabits}
          incompleteGoals={incompleteGoals}
          categories={categories}
          onCompleteHabit={onCompleteHabit}
          onUndoHabit={onUndoHabit}
          onCompleteGoal={onCompleteGoal}
          onUndoGoal={onUndoGoal}
          onDeleteHabit={onDeleteHabit}
        />
      )}
    </div>
  );
}
