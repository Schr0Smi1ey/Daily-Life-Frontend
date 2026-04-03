import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import GoalStatusTabs from "../components/goals/GoalStatusTabs";
import useGoals from "../hooks/useGoals";

function SectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6">
      {(title || subtitle || actions) && (
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {subtitle}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      )}

      {children}
    </section>
  );
}

function GoalsList({
  goals,
  isArchived,
  onDelete,
  onUpdateStatus,
  onLogDay,
  onUnlogDay,
  onDuplicate,
  onArchive,
  onUnarchive,
}) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {goals.map((goal, index) => (
          <motion.div
            key={goal._id}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <GoalCard
              goal={goal}
              isArchived={isArchived}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
              onLogDay={onLogDay}
              onUnlogDay={onUnlogDay}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Goals() {
  const {
    goals,
    archivedGoals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    logDay,
    unlogDay,
    archiveGoal,
    unarchiveGoal,
    duplicateGoal,
  } = useGoals();

  const [showAdd, setShowAdd] = useState(false);
  const [statusTab, setStatusTab] = useState("all");

  const { isArchivedTab, filteredGoals, counts } = useMemo(() => {
    const archivedTab = statusTab === "archived";

    const filtered = archivedTab
      ? archivedGoals
      : goals.filter((goal) =>
          statusTab === "all" ? true : goal.status === statusTab,
        );

    return {
      isArchivedTab: archivedTab,
      filteredGoals: filtered,
      counts: {
        all: goals.length,
        active: goals.filter((goal) => goal.status === "active").length,
        paused: goals.filter((goal) => goal.status === "paused").length,
        completed: goals.filter((goal) => goal.status === "completed").length,
        archived: archivedGoals.length,
      },
    };
  }, [goals, archivedGoals, statusTab]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const emptyMessage = isArchivedTab
    ? "No archived goals."
    : statusTab === "all"
      ? "No goals yet. Set your first one!"
      : `No ${statusTab} goals.`;

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <PageHeader
          title="Goals"
          subtitle="Define what you're working toward and keep your bigger targets moving forward."
        >
          <Button size="sm" onClick={() => setShowAdd(true)}>
            + New Goal
          </Button>
        </PageHeader>

        <SectionCard
          title="Goal states"
          subtitle="Switch between active, paused, completed, and archived goals."
          actions={
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              {filteredGoals.length} visible
            </div>
          }
        >
          <GoalStatusTabs
            active={statusTab}
            onChange={setStatusTab}
            counts={counts}
          />
        </SectionCard>

        {filteredGoals.length === 0 ? (
          <EmptyState
            icon="◈"
            title={isArchivedTab ? "No archived goals" : "No goals found"}
            message={emptyMessage}
            actionLabel={statusTab === "all" ? "Create a Goal" : undefined}
            onAction={statusTab === "all" ? () => setShowAdd(true) : undefined}
          />
        ) : (
          <GoalsList
            goals={filteredGoals}
            isArchived={isArchivedTab}
            onDelete={deleteGoal}
            onUpdateStatus={updateGoal}
            onLogDay={logDay}
            onUnlogDay={unlogDay}
            onDuplicate={duplicateGoal}
            onArchive={archiveGoal}
            onUnarchive={unarchiveGoal}
          />
        )}
      </div>

      <AddGoalModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createGoal}
      />
    </>
  );
}
