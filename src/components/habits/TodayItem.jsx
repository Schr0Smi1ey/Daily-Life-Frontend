import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4.75C8 4.34 8.34 4 8.75 4h6.5c.41 0 .75.34.75.75V6" />
      <path d="M19 6l-1 13.25c-.03.42-.38.75-.8.75H6.8c-.42 0-.77-.33-.8-.75L5 6" />
      <path d="M10 10.25v6.5" />
      <path d="M14 10.25v6.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 4.5 12.5 10 7 15.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4.5 10 3.2 3.2L15.5 5.8" />
    </svg>
  );
}

function getHabitStreak(checkins = []) {
  let count = 0;
  const d = new Date();

  while (true) {
    const key = d.toISOString().split("T")[0];

    if (checkins.some((c) => c.date === key)) {
      count++;
      d.setDate(d.getDate() - 1);
    } else if (count === 0) {
      d.setDate(d.getDate() - 1);
      const prev = d.toISOString().split("T")[0];
      if (!checkins.some((c) => c.date === prev)) break;
    } else {
      break;
    }
  }

  return count;
}

export default function TodayItem({
  item,
  type,
  onComplete,
  onUndoComplete,
  onDelete,
  categories = [],
}) {
  const navigate = useNavigate();

  const [logging, setLogging] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pulseComplete, setPulseComplete] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const isDone =
    type === "habit"
      ? item.checkins?.some((c) => c.date === today)
      : item.doneToday;

  const customCat = categories.find(
    (c) => c.name.toLowerCase() === item.category?.toLowerCase(),
  );

  const streak = useMemo(() => {
    if (type !== "habit") return 0;
    return getHabitStreak(item.checkins || []);
  }, [type, item.checkins]);

  const goToDetail = () => {
    if (type === "habit") navigate(`/habits/${item._id}`);
    else navigate(`/goals/${item._id}`);
  };

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerCompletePulse = () => {
    setPulseComplete(true);
    window.setTimeout(() => setPulseComplete(false), 420);
  };

  const handleComplete = async (e) => {
    stop(e);

    try {
      setLogging(true);

      if (type === "habit") {
        triggerCompletePulse();
        await onComplete(item._id, { date: today });
        return;
      }

      if (item.goalType === "numerical") {
        if (!showInput) {
          setShowInput(true);
          setLogging(false);
          return;
        }

        if (!inputVal) {
          setLogging(false);
          return;
        }

        triggerCompletePulse();
        await onComplete(item._id, Number(inputVal));
        setShowInput(false);
        setInputVal("");
        return;
      }

      triggerCompletePulse();
      await onComplete(item._id, 1);
    } finally {
      setLogging(false);
    }
  };

  const handleUndo = async (e) => {
    stop(e);
    await onUndoComplete(item._id, today);
  };

  return (
    <motion.div
      layout
      onClick={goToDetail}
      whileHover={{ y: -1 }}
      className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
        isDone
          ? "border-zinc-200 bg-zinc-50/70 dark:border-white/10 dark:bg-white/[0.03]"
          : "border-zinc-200 bg-white shadow-sm hover:border-[var(--color-primary)] dark:border-white/10 dark:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div onClick={stop} onMouseDown={stop} onPointerDown={stop}>
          <motion.button
            type="button"
            aria-label={isDone ? "Undo completion" : "Mark complete"}
            onClick={isDone ? handleUndo : handleComplete}
            whileTap={{ scale: 0.88 }}
            animate={
              pulseComplete
                ? {
                    scale: [1, 1.2, 0.94, 1],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full"
          >
            <motion.span
              className={`absolute inset-0 rounded-full border-2 transition-colors duration-200 ${
                isDone
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-zinc-300 bg-white dark:border-white/15 dark:bg-transparent"
              }`}
              animate={
                pulseComplete
                  ? {
                      boxShadow: [
                        "0 0 0 0 rgba(34,197,94,0)",
                        "0 0 0 8px rgba(34,197,94,0.18)",
                        "0 0 0 0 rgba(34,197,94,0)",
                      ],
                    }
                  : { boxShadow: "0 0 0 0 rgba(34,197,94,0)" }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            <AnimatePresence mode="wait">
              {isDone ? (
                <motion.span
                  key="done"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="relative z-10 text-white"
                >
                  <CheckIcon />
                </motion.span>
              ) : logging ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 text-[10px] text-zinc-400"
                >
                  ...
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
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-semibold ${
                isDone
                  ? "line-through text-zinc-500"
                  : "text-zinc-900 dark:text-white"
              }`}
            >
              {item.name || item.title}
            </p>

            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
              {type}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge category={item.category} customColor={customCat?.color} />

            {type === "habit" && streak > 0 && (
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {streak}🔥
              </span>
            )}

            {type === "goal" &&
              item.goalType === "numerical" &&
              item.todayTarget && (
                <span className="text-xs text-zinc-500">
                  Target: {item.todayTarget.target} {item.unit}
                </span>
              )}
          </div>

          <AnimatePresence>
            {showInput && type === "goal" && !isDone && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-3 flex items-center gap-2"
                onClick={stop}
              >
                <input
                  type="number"
                  className="w-28 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs outline-none transition focus:border-[var(--color-primary)] dark:border-white/10 dark:bg-zinc-900"
                  placeholder={`${item.unit || "amount"}?`}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComplete(e)}
                  autoFocus
                />

                <Button size="sm" onClick={handleComplete} disabled={!inputVal}>
                  {logging ? "..." : "Log"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setShowInput(false);
                    setInputVal("");
                  }}
                  className="text-xs text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5" onClick={stop}>
          {isDone && (
            <button
              type="button"
              onClick={handleUndo}
              className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white"
            >
              Undo
            </button>
          )}

          {!isDone && type === "habit" && (
            <>
              {showConfirm ? (
                <div className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-2 py-1 dark:border-red-500/20 dark:bg-red-500/10">
                  <span className="text-xs text-zinc-600 dark:text-zinc-300">
                    Delete?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(item._id);
                      setShowConfirm(false);
                    }}
                    className="text-xs font-semibold text-red-500"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="text-xs text-zinc-500"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Delete item"
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                  <TrashIcon />
                </button>
              )}
            </>
          )}

          <span className="text-zinc-400 transition group-hover:translate-x-0.5">
            <ChevronRightIcon />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
