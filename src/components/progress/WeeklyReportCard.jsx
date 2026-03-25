export default function WeeklyReportCard({ report }) {
  if (!report) return null;

  const { bestHabit, worstDay, overallPct } = report;

  const formatDay = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const grade =
    overallPct >= 90
      ? { label: "Excellent", color: "text-green-400" }
      : overallPct >= 70
        ? { label: "Good", color: "text-primary" }
        : overallPct >= 50
          ? { label: "Average", color: "text-yellow-400" }
          : { label: "Keep Going", color: "text-red-400" };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      {/* Overall */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
            This Week
          </p>
          <p className="text-5xl font-black text-white">{overallPct}%</p>
          <p
            className="text-sm font-semibold mt-1"
            style={
              grade.color === "text-primary"
                ? { color: "var(--color-primary)" }
                : {
                    color:
                      grade.color === "text-green-400"
                        ? "#4ade80"
                        : grade.color === "text-yellow-400"
                          ? "#facc15"
                          : "#f87171",
                  }
            }
          >
            {grade.label}
          </p>
        </div>
        <div className="text-6xl">
          {overallPct >= 90
            ? "🏆"
            : overallPct >= 70
              ? "💪"
              : overallPct >= 50
                ? "📈"
                : "🎯"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Best habit */}
        <div className="bg-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
            Best Habit
          </p>
          <p className="text-white font-semibold text-sm">
            {bestHabit?.name || "—"}
          </p>
          {bestHabit?.rate > 0 && (
            <p
              className="text-xs mt-1"
              style={{ color: "var(--color-primary)" }}
            >
              {bestHabit.rate}/7 days
            </p>
          )}
        </div>

        {/* Worst day */}
        <div className="bg-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
            Weakest Day
          </p>
          <p className="text-white font-semibold text-sm">
            {formatDay(worstDay?.date)}
          </p>
          {worstDay && (
            <p className="text-zinc-500 text-xs mt-1">
              {worstDay.completed}/{worstDay.total} habits
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
