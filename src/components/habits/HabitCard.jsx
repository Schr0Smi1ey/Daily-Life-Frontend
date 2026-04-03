import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function getLast7Days(checkins = [], today) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().split("T")[0];

    return {
      key,
      done: checkins.some((checkin) => checkin.date === key),
      isToday: key === today,
    };
  });
}

function getCurrentStreak(checkins = []) {
  let streak = 0;
  const date = new Date();

  while (true) {
    const key = date.toISOString().split("T")[0];

    if (checkins.some((checkin) => checkin.date === key)) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    } else if (streak === 0) {
      date.setDate(date.getDate() - 1);
      const previousKey = date.toISOString().split("T")[0];
      if (!checkins.some((checkin) => checkin.date === previousKey)) break;
    } else {
      break;
    }
  }

  return streak;
}

function CheckinDots({ dots }) {
  return (
    <div className="flex gap-1.5">
      {dots.map((dot) => (
        <span
          key={dot.key}
          className="h-2.5 w-2.5 rounded-sm transition-all duration-300"
          style={{
            backgroundColor: dot.done
              ? "var(--color-primary)"
              : dot.isToday
                ? "rgb(113 113 122)"
                : "rgb(228 228 231)",
          }}
        />
      ))}
    </div>
  );
}

function HabitMeta({ habit, customColor }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <Badge category={habit.category} customColor={customColor} />
      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium capitalize text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
        {habit.frequency}
      </span>
      {habit.routine !== "none" && (
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
          {habit.routine === "morning" ? "☀️ Morning" : "🌙 Night"}
        </span>
      )}
    </div>
  );
}

export default function HabitCard({
  habit,
  categories = [],
  showUndo = false,
  onUndo,
  onComplete,
}) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [isAnimatingComplete, setIsAnimatingComplete] = useState(false);

  const { isDone, customCategory, dots, streak } = useMemo(() => {
    const checkins = habit.checkins || [];

    return {
      isDone: checkins.some((checkin) => checkin.date === today),
      customCategory: categories.find(
        (category) =>
          category.name.toLowerCase() === habit.category?.toLowerCase(),
      ),
      dots: getLast7Days(checkins, today),
      streak: getCurrentStreak(checkins),
    };
  }, [habit, categories, today]);

  const stopCardNavigation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCompleteToggle = async (e) => {
    stopCardNavigation(e);

    if (isDone) {
      await onUndo?.(habit._id);
      return;
    }

    setIsAnimatingComplete(true);
    try {
      await onComplete?.(habit._id, { date: today });
    } finally {
      setTimeout(() => setIsAnimatingComplete(false), 450);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onClick={() => navigate(`/habits/${habit._id}`)}
      className={`group cursor-pointer rounded-3xl border p-4 transition-all duration-300 md:p-5 ${
        isDone
          ? "border-zinc-200 bg-zinc-50/80 dark:border-white/10 dark:bg-white/[0.03]"
          : "border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-[var(--color-primary)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-[var(--color-primary)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className="shrink-0"
          onClick={stopCardNavigation}
          onMouseDown={stopCardNavigation}
          onPointerDown={stopCardNavigation}
        >
          <motion.button
            type="button"
            aria-label={
              isDone ? "Undo habit completion" : "Mark habit complete"
            }
            onClick={handleCompleteToggle}
            whileTap={{ scale: 0.9 }}
            animate={
              isAnimatingComplete
                ? {
                    scale: [1, 1.2, 0.96, 1],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.35 }}
            className="relative flex h-7 w-7 items-center justify-center rounded-full"
          >
            <motion.span
              className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                isDone
                  ? "border-green-500 bg-green-500 text-white shadow-[0_0_18px_rgba(34,197,94,0.35)]"
                  : "border-zinc-300 bg-white dark:border-white/15 dark:bg-transparent"
              }`}
              animate={
                isAnimatingComplete
                  ? {
                      boxShadow: [
                        "0 0 0 rgba(34,197,94,0)",
                        "0 0 0 8px rgba(34,197,94,0.18)",
                        "0 0 0 rgba(34,197,94,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.45 }}
            />

            <AnimatePresence mode="wait">
              {isDone ? (
                <motion.span
                  key="done"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 text-xs font-bold text-white"
                >
                  ✓
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 h-2.5 w-2.5 rounded-full bg-transparent"
                />
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-semibold md:text-[15px] ${
              isDone
                ? "text-zinc-500 line-through dark:text-zinc-500"
                : "text-zinc-950 dark:text-white"
            }`}
          >
            {habit.name}
          </p>

          <HabitMeta habit={habit} customColor={customCategory?.color} />
        </div>

        <div className="hidden shrink-0 md:block">
          <CheckinDots dots={dots} />
        </div>

        {streak > 0 && (
          <div
            className="hidden shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold md:block"
            style={{
              color: "var(--color-primary)",
              backgroundColor: "rgba(var(--color-primary-rgb), 0.08)",
            }}
          >
            {streak}🔥
          </div>
        )}

        {showUndo && isDone ? (
          <div
            className="shrink-0"
            onClick={stopCardNavigation}
            onMouseDown={stopCardNavigation}
            onPointerDown={stopCardNavigation}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUndo?.(habit._id)}
            >
              Undo
            </Button>
          </div>
        ) : (
          <div className="shrink-0 text-sm text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 dark:text-zinc-500">
            →
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
        <CheckinDots dots={dots} />
        {streak > 0 && (
          <div
            className="rounded-2xl px-3 py-1.5 text-xs font-semibold"
            style={{
              color: "var(--color-primary)",
              backgroundColor: "rgba(var(--color-primary-rgb), 0.08)",
            }}
          >
            {streak}🔥
          </div>
        )}
      </div>
    </motion.div>
  );
}
