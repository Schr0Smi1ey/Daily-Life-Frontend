import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import ConfettiBlast from "../components/ui/ConfettiBlast";
import TodayOverview from "../components/habits/TodayOverview";
import HabitCard from "../components/habits/HabitCard";
import AddHabitModal from "../components/habits/AddHabitModal";
import HabitTemplatesModal from "../components/habits/HabitTemplatesModal";
import useHabits from "../hooks/useHabits";
import useGoals from "../hooks/useGoals";
import useCategories from "../hooks/useCategories";
import useTemplates from "../hooks/useTemplates";

function SectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6">
      {(title || subtitle || actions) && (
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
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

function FilterTabs({ filters, activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <motion.button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
              isActive
                ? "border-transparent text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
            }`}
            style={isActive ? { backgroundColor: "var(--color-primary)" } : {}}
          >
            <span>{filter.label}</span>
            {filter.count > 0 ? (
              <span
                className={
                  isActive
                    ? "text-black/60"
                    : "text-zinc-400 dark:text-zinc-500"
                }
              >
                {filter.count}
              </span>
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}

function HabitsList({ habits, categories, showUndo, onUndo, onComplete }) {
  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {habits.map((habit, index) => (
          <motion.div
            key={habit._id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <HabitCard
              habit={habit}
              categories={categories}
              showUndo={showUndo}
              onUndo={onUndo}
              onComplete={onComplete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Habits() {
  const {
    habits,
    loading: habitsLoading,
    createHabit,
    deleteHabit,
    checkin,
    undoCheckin,
    fetchTemplates,
    addBulkHabits,
  } = useHabits();

  const { loading: goalsLoading, logDay, unlogDay, getTodayGoals } = useGoals();
  const { categories } = useCategories();
  const { refetch: refetchTemplates } = useTemplates();

  const [showAdd, setShowAdd] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filter, setFilter] = useState("all");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayGoals = getTodayGoals?.() || [];

  const completedToday = useMemo(
    () =>
      habits.filter((habit) =>
        habit.checkins?.some((checkin) => checkin.date === today),
      ),
    [habits, today],
  );

  const incompleteToday = useMemo(
    () =>
      habits.filter(
        (habit) => !habit.checkins?.some((checkin) => checkin.date === today),
      ),
    [habits, today],
  );

  const allDoneToday =
    habits.length > 0 &&
    habits.every((habit) =>
      habit.checkins?.some((checkin) => checkin.date === today),
    );

  const filteredHabits = useMemo(() => {
    if (filter === "completed") return completedToday;
    if (filter === "morning") {
      return incompleteToday.filter((habit) => habit.routine === "morning");
    }
    if (filter === "night") {
      return incompleteToday.filter((habit) => habit.routine === "night");
    }
    if (filter === "general") {
      return incompleteToday.filter((habit) => habit.routine === "none");
    }
    return habits;
  }, [filter, habits, completedToday, incompleteToday]);

  const filters = useMemo(
    () => [
      { value: "all", label: "All", count: habits.length },
      {
        value: "morning",
        label: "☀️ Morning",
        count: habits.filter((habit) => habit.routine === "morning").length,
      },
      {
        value: "night",
        label: "🌙 Night",
        count: habits.filter((habit) => habit.routine === "night").length,
      },
      {
        value: "general",
        label: "General",
        count: habits.filter((habit) => habit.routine === "none").length,
      },
      {
        value: "completed",
        label: "✓ Done Today",
        count: completedToday.length,
      },
    ],
    [habits, completedToday.length],
  );

  const handleAddSingle = async (habit) => {
    await createHabit(habit);
  };

  const handleAddBulk = async (selectedHabits) => {
    await addBulkHabits(selectedHabits);
    setShowTemplates(false);
  };

  const handleFetchTemplatesForModal = async () => {
    await refetchTemplates();
    return fetchTemplates?.();
  };

  if (habitsLoading || goalsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const emptyMessage =
    filter === "completed"
      ? "No habits completed today yet."
      : `No ${filter} habits.`;

  return (
    <>
      <ConfettiBlast trigger={allDoneToday} />

      <div className="space-y-6 md:space-y-8">
        <PageHeader
          title="Habits"
          subtitle="Build consistency, stay intentional, and check in with your routines every day."
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(true)}
          >
            📋 Templates
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            + New Habit
          </Button>
        </PageHeader>

        <SectionCard
          title="Today overview"
          subtitle="See what needs attention right now across habits and daily goal logging."
        >
          <TodayOverview
            habits={habits}
            goals={todayGoals}
            categories={categories}
            onCompleteHabit={(id, data) => checkin(id, data)}
            onUndoHabit={(id, date) => undoCheckin(id, date)}
            onCompleteGoal={(id, val) => logDay(id, val)}
            onUndoGoal={(id) => unlogDay(id)}
            onDeleteHabit={deleteHabit}
          />
        </SectionCard>

        {habits.length > 0 ? (
          <SectionCard
            title="Your habits"
            subtitle="Browse by routine, review completions, and stay focused on what matters today."
            actions={
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                {filteredHabits.length} visible
              </div>
            }
          >
            <div className="mb-5">
              <FilterTabs
                filters={filters}
                activeFilter={filter}
                onChange={setFilter}
              />
            </div>

            {filteredHabits.length === 0 ? (
              <EmptyState
                icon="◎"
                title="Nothing here yet"
                message={emptyMessage}
                actionLabel={filter === "all" ? "Add Habit" : undefined}
                onAction={filter === "all" ? () => setShowAdd(true) : undefined}
              />
            ) : (
              <HabitsList
                habits={filteredHabits}
                categories={categories}
                showUndo={filter === "completed"}
                onUndo={(id) => undoCheckin(id, today)}
                onComplete={(id, data) => checkin(id, data)}
              />
            )}
          </SectionCard>
        ) : (
          <EmptyState
            icon="◎"
            title="No habits yet"
            message="Start with a template or create your own first habit to begin building consistency."
            actionLabel="Browse Templates"
            onAction={() => setShowTemplates(true)}
          />
        )}
      </div>

      <AddHabitModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createHabit}
      />

      <HabitTemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        fetchTemplates={handleFetchTemplatesForModal}
        onAddSingle={handleAddSingle}
        onAddBulk={handleAddBulk}
      />
    </>
  );
}
