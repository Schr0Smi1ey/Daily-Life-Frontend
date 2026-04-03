export default function HabitHeatmap({ checkins = [], weeks = 12 }) {
  const days = weeks * 7;
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];
    const done = checkins.some((c) => c.date === key);
    return {
      key,
      done,
      isToday: key === new Date().toISOString().split("T")[0],
    };
  });

  const weeks_ = [];
  for (let w = 0; w < weeks; w++) {
    weeks_.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1">
          {weeks_.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={cell.key}
                  className={`w-3 h-3 rounded-sm transition ${
                    cell.isToday && !cell.done
                      ? "ring-1 ring-[var(--color-primary)] bg-zinc-800"
                      : ""
                  }`}
                  style={
                    cell.done
                      ? { backgroundColor: "var(--color-primary)" }
                      : cell.isToday
                        ? {}
                        : { backgroundColor: "#27272a" }
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-zinc-600">Less</span>
        {[
          "#27272a",
          "rgba(var(--color-primary-rgb),0.3)",
          "var(--color-primary)",
        ].map((c, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ background: c }}
          />
        ))}
        <span className="text-xs text-zinc-600">More</span>
      </div>
    </div>
  );
}
