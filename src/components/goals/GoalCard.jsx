import { useState } from "react";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import MilestoneItem from "./MilestoneItem";

export default function GoalCard({
  goal,
  onDelete,
  onUpdateStatus,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
}) {
  const [newMs, setNewMs] = useState("");
  const [showMs, setShowMs] = useState(false);
  const [addingMs, setAddingMs] = useState(false);

  // Progress
  const total = goal.milestones?.length || 0;
  const done = goal.milestones?.filter((m) => m.done).length || 0;
  const progress = total
    ? Math.round((done / total) * 100)
    : goal.status === "completed"
      ? 100
      : 0;

  // Deadline warning
  const deadlineWarning = (() => {
    if (!goal.startDate || !goal.targetDays) return null;
    const end = new Date(goal.startDate);
    end.setDate(end.getDate() + goal.targetDays);
    const today = new Date();
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3 && daysLeft >= 0 && goal.status === "active")
      return daysLeft;
    return null;
  })();

  const handleAddMilestone = async () => {
    if (!newMs.trim()) return;
    setAddingMs(true);
    await onAddMilestone(goal._id, newMs);
    setNewMs("");
    setAddingMs(false);
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-white font-bold text-base">{goal.title}</h3>
          {goal.description && (
            <p className="text-zinc-500 text-sm mt-0.5">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {goal.status === "active" && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
                // opacity: 0.15,
              }}
            >
              {goal.status}
            </span>
          )}
          {goal.status === "completed" && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400">
              {goal.status}
            </span>
          )}
          {goal.status === "paused" && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-700 text-zinc-400">
              {goal.status}
            </span>
          )}
          <button
            onClick={() => onDelete(goal._id)}
            className="text-zinc-700 hover:text-red-400 transition text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Deadline warning */}
      {deadlineWarning !== null && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-red-400 text-xs font-semibold">
            ⚠️{" "}
            {deadlineWarning === 0
              ? "Due today!"
              : `${deadlineWarning} day${deadlineWarning > 1 ? "s" : ""} left`}
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-zinc-500">
            {total ? `${done}/${total} milestones` : "No milestones"}
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {progress}%
          </span>
        </div>
        <ProgressBar
          value={progress}
          color={goal.status === "completed" ? "green" : "primary"}
        />
      </div>

      {/* Target days */}
      <p className="text-xs text-zinc-600 mb-3">
        {goal.targetDays} day goal · started {goal.startDate}
      </p>

      {/* Status buttons */}
      <div className="flex gap-2 mb-3">
        {["active", "paused", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => onUpdateStatus(goal._id, { status: s })}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              goal.status === s
                ? "text-white"
                : "bg-zinc-800 text-zinc-600 hover:text-white"
            }`}
            style={
              goal.status === s
                ? { backgroundColor: "var(--color-primary)" }
                : {}
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Milestones toggle */}
      <button
        onClick={() => setShowMs(!showMs)}
        className="text-xs text-zinc-500 transition mb-2"
        style={{ color: "var(--color-primary)" }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        {showMs ? "▲ Hide" : "▼ Show"} milestones
      </button>

      {showMs && (
        <div className="mt-2">
          {/* Milestone list */}
          {goal.milestones?.map((ms) => (
            <MilestoneItem
              key={ms._id}
              milestone={ms}
              onToggle={() => onToggleMilestone(goal._id, ms._id)}
              onDelete={() => onDeleteMilestone(goal._id, ms._id)}
            />
          ))}

          {/* Add milestone */}
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none transition"
              style={{ borderColor: "var(--color-primary)" }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) => (e.target.style.borderColor = "")}
              placeholder="Add a milestone..."
              value={newMs}
              onChange={(e) => setNewMs(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
            />
            <Button size="sm" onClick={handleAddMilestone} disabled={addingMs}>
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
