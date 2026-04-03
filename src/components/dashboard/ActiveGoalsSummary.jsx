import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProgressBar from "../ui/ProgressBar";

function GoalRow({ goal }) {
  const totalMilestones = goal.milestones?.length || 0;
  const completedMilestones =
    goal.milestones?.filter((milestone) => milestone.done).length || 0;
  const progress = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-white/8 dark:bg-white/[0.03]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="truncate pr-2 text-sm font-medium text-zinc-900 dark:text-white">
          {goal.title}
        </span>
        <span
          className="shrink-0 text-xs font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {progress}%
        </span>
      </div>

      <ProgressBar value={progress} color="primary" />

      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>
          {completedMilestones}/{totalMilestones} milestones
        </span>
        <span>{progress === 100 ? "Ready to complete" : "In progress"}</span>
      </div>
    </div>
  );
}

export default function ActiveGoalsSummary({ goals = [] }) {
  const navigate = useNavigate();

  const { activeGoals, visibleGoals, remainingCount } = useMemo(() => {
    const active = goals.filter((goal) => goal.status === "active");
    return {
      activeGoals: active,
      visibleGoals: active.slice(0, 3),
      remainingCount: Math.max(active.length - 3, 0),
    };
  }, [goals]);

  return (
    <motion.button
      type="button"
      onClick={() => navigate("/goals")}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="group relative w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-300 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-primary)]/10 blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
              Active goals
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Focus on the goals currently moving forward.
            </p>
          </div>

          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
            {activeGoals.length} active
          </span>
        </div>

        {visibleGoals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-8 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No active goals yet
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Start one to track progress here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleGoals.map((goal) => (
              <GoalRow key={goal._id} goal={goal} />
            ))}

            <div className="flex items-center justify-between pt-1">
              {remainingCount > 0 ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  +{remainingCount} more active goal
                  {remainingCount > 1 ? "s" : ""}
                </p>
              ) : (
                <span />
              )}

              <span className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-300">
                Open goals →
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}
