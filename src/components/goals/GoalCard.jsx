import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";
import GoalConfirmModal from "./GoalConfirmModal";

export default function GoalCard({
  goal,
  onDelete,
  onUpdateStatus,
  onLogDay,
  onUnlogDay,
  onDuplicate,
  onArchive,
  onUnarchive,
  isArchived = false,
}) {
  const navigate = useNavigate();

  const [logging, setLogging] = useState(false);
  const [actualInput, setActualInput] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [pulse, setPulse] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const {
    progress,
    todayTarget,
    doneToday,
    onTrack,
    deficit,
    dayNum,
    daysLeft,
    isWarning,
    isOverdue,
  } = useMemo(() => {
    const start = new Date(goal.startDate);
    const now = new Date();
    const daysPast = Math.max(1, Math.ceil((now - start) / 86400000));
    const dayNum = Math.min(daysPast, goal.targetDays);
    const daysLeft = Math.max(0, goal.targetDays - dayNum);

    const isWarning = daysLeft <= 3 && daysLeft > 0 && goal.status === "active";
    const isOverdue = daysLeft === 0 && goal.status === "active";

    let progress = 0,
      todayTarget = null,
      doneToday = false,
      onTrack = true,
      deficit = 0;

    if (goal.goalType === "numerical") {
      const totalLogged =
        goal.dailyTargets?.reduce((s, d) => s + (d.actual || 0), 0) || 0;
      const totalTarget = goal.totalTarget || 1;

      progress = Math.round((totalLogged / totalTarget) * 100);
      todayTarget = goal.dailyTargets?.find((d) => d.date === today);
      doneToday = todayTarget?.locked || false;

      const expected =
        goal.dailyTargets
          ?.filter((d) => d.date <= today)
          .reduce((s, d) => s + d.target, 0) || 0;

      onTrack = totalLogged >= expected;
      deficit = Math.max(0, expected - totalLogged);
    } else {
      const completed = goal.completedDays?.length || 0;
      progress = Math.round((completed / goal.targetDays) * 100);
      doneToday = goal.completedDays?.includes(today);
      onTrack = completed >= dayNum;
      deficit = Math.max(0, dayNum - completed);
    }

    return {
      progress,
      todayTarget,
      doneToday,
      onTrack,
      deficit,
      dayNum,
      daysLeft,
      isWarning,
      isOverdue,
    };
  }, [goal, today]);

  const triggerPulse = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  const handleLogDay = async () => {
    try {
      setLogging(true);
      triggerPulse();

      if (goal.goalType === "numerical") {
        await onLogDay(goal._id, Number(actualInput));
        setActualInput("");
        setShowLog(false);
      } else {
        await onLogDay(goal._id, 1);
      }
    } finally {
      setLogging(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        whileHover={{ y: -2 }}
        onClick={() => !isArchived && navigate(`/goals/${goal._id}`)}
        className={`group rounded-3xl border p-5 transition ${
          isArchived
            ? "border-zinc-200 bg-zinc-50/60 opacity-70 dark:border-white/10 dark:bg-white/[0.03]"
            : "border-zinc-200 bg-white shadow-sm hover:border-[var(--color-primary)] dark:border-white/10 dark:bg-white/[0.03]"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between mb-3">
          <div>
            <p className="text-xs tracking-widest text-zinc-500">
              Day {dayNum} / {goal.targetDays}
            </p>

            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {goal.title}
            </h3>

            {goal.description && (
              <p className="text-xs text-zinc-500 truncate">
                {goal.description}
              </p>
            )}
          </div>

          {!isArchived && (
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-white/10">
              {goal.status}
            </span>
          )}
        </div>

        {/* Status */}
        {!isArchived && (
          <div className="mb-3 text-xs font-medium">
            {isOverdue ? (
              <span className="text-red-400">⚠️ Overdue</span>
            ) : isWarning ? (
              <span className="text-yellow-400">⚠️ {daysLeft} days left</span>
            ) : onTrack ? (
              <span className="text-green-400">On track</span>
            ) : (
              <span className="text-yellow-400">Behind ({deficit})</span>
            )}
          </div>
        )}

        {/* Logging */}
        {!isArchived && goal.status === "active" && (
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            {goal.goalType === "numerical" ? (
              <>
                {doneToday ? (
                  <button
                    onClick={() => onUnlogDay(goal._id)}
                    className="text-xs text-zinc-500 hover:text-zinc-900"
                  >
                    Undo log
                  </button>
                ) : showLog ? (
                  <div className="flex gap-2">
                    <input
                      value={actualInput}
                      onChange={(e) => setActualInput(e.target.value)}
                      className="border rounded-lg px-3 py-1 text-sm w-24"
                      placeholder={goal.unit}
                    />
                    <Button size="sm" onClick={handleLogDay}>
                      Log
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setShowLog(true)}>
                    Log today
                  </Button>
                )}
              </>
            ) : doneToday ? (
              <button onClick={() => onUnlogDay(goal._id)}>Undo</button>
            ) : (
              <Button size="sm" onClick={handleLogDay}>
                Mark done
              </Button>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="mb-3">
          <ProgressBar value={progress} />
        </div>

        {/* Footer */}
        <div
          className="flex justify-between pt-3 border-t border-zinc-200 dark:border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDuplicate(goal._id)}
            >
              Duplicate
            </Button>
            {!isArchived && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmType("archive")}
              >
                Archive
              </Button>
            )}
          </div>

          <Button
            size="sm"
            variant="danger"
            onClick={() => setConfirmType("delete")}
          >
            Delete
          </Button>
        </div>
      </motion.div>

      <GoalConfirmModal
        isOpen={!!confirmType}
        onClose={() => setConfirmType(null)}
        goal={goal}
        type={confirmType}
        onConfirm={() => {
          if (confirmType === "delete") onDelete(goal._id);
          if (confirmType === "archive") onArchive(goal._id);
        }}
      />
    </>
  );
}
