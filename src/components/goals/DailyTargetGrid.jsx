import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="8.5" width="11" height="8" rx="2" />
      <path d="M7 8.5V6.8A3 3 0 0 1 10 4a3 3 0 0 1 3 2.8v1.7" />
    </svg>
  );
}

function StatusDot({ locked, isToday }) {
  if (locked) {
    return <span className="text-xs font-semibold text-green-400">✓</span>;
  }

  if (isToday) {
    return (
      <span
        className="text-xs font-semibold"
        style={{ color: "var(--color-primary)" }}
      >
        ●
      </span>
    );
  }

  return <span className="text-xs text-zinc-400 dark:text-zinc-500">○</span>;
}

function DayBadge({ isPast, isToday, isFuture }) {
  const label = isToday ? "Today" : isPast ? "Past" : "Future";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
        isToday
          ? "text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.10)]"
          : isPast
            ? "bg-zinc-100 text-zinc-500 dark:bg-white/[0.04] dark:text-zinc-400"
            : "bg-zinc-100 text-zinc-700 dark:bg-white/[0.05] dark:text-zinc-300"
      }`}
    >
      {label}
    </span>
  );
}

export default function DailyTargetGrid({
  dailyTargets,
  unit,
  today,
  onOverride,
}) {
  const [editingDay, setEditingDay] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const closeEditor = () => {
    setEditingDay(null);
    setEditValue("");
  };

  const handleOverride = async (day) => {
    if (!editValue || Number(editValue) < 0) return;

    try {
      setSaving(true);
      await onOverride(day, Number(editValue));
      closeEditor();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
      {dailyTargets.map((day) => {
        const isPast = day.date < today;
        const isToday = day.date === today;
        const isFuture = day.date > today;
        const isEditing = editingDay === day.day;

        return (
          <motion.div
            key={day.day}
            layout
            whileHover={{ y: -1 }}
            className={`rounded-2xl border px-4 py-4 transition-all duration-300 ${
              isToday
                ? "border-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.06)]"
                : isPast
                  ? "border-zinc-200 bg-zinc-50/70 dark:border-white/10 dark:bg-white/[0.02]"
                  : "border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex w-6 shrink-0 justify-center pt-0.5">
                <StatusDot locked={day.locked} isToday={isToday} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          isToday
                            ? "text-[var(--color-primary)]"
                            : "text-zinc-950 dark:text-white"
                        }`}
                      >
                        Day {day.day}
                      </p>
                      <DayBadge
                        isPast={isPast}
                        isToday={isToday}
                        isFuture={isFuture}
                      />
                      {day.locked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:bg-white/[0.04] dark:text-zinc-400">
                          <LockIcon />
                          Locked
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {day.date}
                    </p>
                  </div>

                  {!isEditing ? (
                    <div className="shrink-0">
                      {isFuture ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingDay(day.day);
                            setEditValue(String(day.target));
                          }}
                        >
                          Edit
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                      >
                        <input
                          type="number"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-[var(--color-primary)] dark:border-white/10 dark:bg-zinc-900 dark:text-white sm:w-28"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleOverride(day.day);
                            if (e.key === "Escape") closeEditor();
                          }}
                        />

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleOverride(day.day)}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={closeEditor}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <span
                          className={`text-sm font-semibold ${
                            isPast
                              ? "text-zinc-600 dark:text-zinc-400"
                              : "text-zinc-950 dark:text-white"
                          }`}
                        >
                          {day.target} {unit}
                        </span>

                        {day.locked ? (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            → {day.actual} logged
                          </span>
                        ) : null}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
