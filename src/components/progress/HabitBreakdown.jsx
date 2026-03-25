import ProgressBar from "../ui/ProgressBar";

export default function HabitBreakdown({ habits = [] }) {
  if (!habits.length)
    return (
      <p className="text-zinc-600 text-sm text-center py-8">
        No habits to report yet.
      </p>
    );

  return (
    <div className="flex flex-col gap-4">
      {habits.map((h) => (
        <div key={h.id}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm text-zinc-300">{h.name}</span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {h.rate}%
            </span>
          </div>
          <ProgressBar value={h.rate} color="primary" />
        </div>
      ))}
    </div>
  );
}
