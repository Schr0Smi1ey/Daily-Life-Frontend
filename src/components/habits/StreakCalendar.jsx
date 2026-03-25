export default function StreakCalendar({ habits }) {
  const weeks = 12;
  const days = weeks * 7;

  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];
    const total = habits.length;
    const done = habits.filter((h) =>
      h.checkins?.some((c) => c.date === key),
    ).length;
    return { key, total, done };
  });

  const weeks_ = [];
  for (let w = 0; w < weeks; w++) {
    weeks_.push(cells.slice(w * 7, w * 7 + 7));
  }

  const getCellStyle = (pct) => {
    if (pct === 0) {
      return { backgroundColor: "#3f3f46" }; // bg-zinc-800
    } else if (pct < 0.5) {
      return { backgroundColor: "var(--color-primary)", opacity: 0.3 };
    } else if (pct < 1) {
      return { backgroundColor: "var(--color-primary)", opacity: 0.6 };
    } else {
      return { backgroundColor: "var(--color-primary)" };
    }
  };

  const getLegendStyle = (index) => {
    switch (index) {
      case 0:
        return { backgroundColor: "#3f3f46" }; // bg-zinc-800
      case 1:
        return { backgroundColor: "var(--color-primary)", opacity: 0.3 };
      case 2:
        return { backgroundColor: "var(--color-primary)", opacity: 0.6 };
      case 3:
        return { backgroundColor: "var(--color-primary)" };
      default:
        return {};
    }
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1">
        {weeks_.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) => {
              const pct = cell.total ? cell.done / cell.total : 0;
              const cellStyle = getCellStyle(pct);

              return (
                <div
                  key={di}
                  title={`${cell.key}: ${cell.done}/${cell.total}`}
                  className="w-3 h-3 rounded-sm"
                  style={cellStyle}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-zinc-600">Less</span>
        {[0, 1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={getLegendStyle(i)}
          />
        ))}
        <span className="text-xs text-zinc-600">More</span>
      </div>
    </div>
  );
}
