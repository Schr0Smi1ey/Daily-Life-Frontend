import Button from "../ui/Button";

export default function TimeLogHistory({ logs = [], onDelete }) {
  const format = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (!logs.length)
    return (
      <p className="text-zinc-600 text-sm text-center py-6">
        No sessions logged yet. Start the timer above.
      </p>
    );

  const totalSecs = logs.reduce((s, l) => s + l.duration, 0);

  return (
    <div>
      {/* Total */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-zinc-500">
          {logs.length} session{logs.length > 1 ? "s" : ""}
        </p>
        <p
          className="text-sm font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          Total: {format(totalSecs)}
        </p>
      </div>

      {/* Log list */}
      <div className="flex flex-col gap-2">
        {logs.map((log) => (
          <div
            key={log._id}
            className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3"
          >
            <div>
              <p className="text-white text-sm font-semibold">
                {format(log.duration)}
              </p>
              <p className="text-zinc-500 text-xs">
                {formatDate(log.date)} · {log.type}
              </p>
            </div>
            <button
              onClick={() => onDelete(log._id)}
              className="text-zinc-700 hover:text-red-400 transition text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
