import { useState } from "react";
import Badge from "../ui/Badge";
import CheckinModal from "./CheckinModal";
import Button from "../ui/Button";

export default function HabitItem({
  habit,
  onCheckin,
  onUndoCheckin,
  onDelete,
}) {
  const [showCheckin, setShowCheckin] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const isDoneToday = habit.checkins?.some((c) => c.date === today);

  // Calculate streak
  const streak = (() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split("T")[0];
      if (habit.checkins?.some((c) => c.date === key)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else if (count === 0) {
        d.setDate(d.getDate() - 1);
        const prev = d.toISOString().split("T")[0];
        if (!habit.checkins?.some((c) => c.date === prev)) break;
      } else break;
    }
    return count;
  })();

  // Last 7 days dots
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return habit.checkins?.some((c) => c.date === key);
  });

  return (
    <>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl border transition ${
          isDoneToday
            ? "bg-zinc-900/50"
            : "bg-zinc-900 border-white/10 hover:border-white/20"
        }`}
        style={isDoneToday ? { borderColor: "var(--color-primary)" } : {}}
      >
        {/* Check button */}
        <button
          onClick={() =>
            isDoneToday ? onUndoCheckin(habit._id, today) : setShowCheckin(true)
          }
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
            isDoneToday ? "text-black" : "border-zinc-600"
          }`}
          style={
            isDoneToday
              ? {
                  backgroundColor: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                }
              : { borderColor: "var(--color-primary)" }
          }
          onMouseEnter={(e) => {
            if (!isDoneToday) {
              e.target.style.borderColor = "var(--color-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDoneToday) {
              e.target.style.borderColor = "";
            }
          }}
        >
          {isDoneToday && <span className="text-xs font-bold">✓</span>}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold ${isDoneToday ? "line-through text-zinc-500" : "text-white"}`}
          >
            {habit.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge category={habit.category} />
            {/* 7 day dots */}
            <div className="flex gap-1 ml-1">
              {dots.map((done, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-sm ${done ? "" : "bg-zinc-700"}`}
                  style={
                    done ? { backgroundColor: "var(--color-primary)" } : {}
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div
            className="text-sm font-black flex-shrink-0"
            style={{ color: "var(--color-primary)" }}
          >
            {streak}🔥
          </div>
        )}

        {/* Delete */}
        <Button variant="danger" size="sm" onClick={() => onDelete(habit._id)}>
          ✕
        </Button>
      </div>

      <CheckinModal
        isOpen={showCheckin}
        onClose={() => setShowCheckin(false)}
        habit={habit}
        onCheckin={onCheckin}
      />
    </>
  );
}
