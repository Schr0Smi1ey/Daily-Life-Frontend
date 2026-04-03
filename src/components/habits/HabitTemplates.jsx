import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";

export default function HabitTemplates({
  fetchTemplates,
  onAddBulk,
  onAddSingle,
}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetchTemplates().then((data) => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  const pack = templates[active];

  return (
    <div>
      {/* Pack tabs */}
      <div className="flex gap-2 mb-4">
        {templates.map((t, i) => (
          <button
            key={t.pack}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              active === i
                ? "text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
            style={
              active === i ? { backgroundColor: "var(--color-primary)" } : {}
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Habit list */}
      <div className="flex flex-col gap-2 mb-4">
        {pack?.habits.map((h, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-white font-medium">{h.name}</span>
              <Badge category={h.category} />
            </div>
            <Button size="sm" variant="ghost" onClick={() => onAddSingle(h)}>
              + Add
            </Button>
          </div>
        ))}
      </div>

      {/* Add whole pack */}
      <Button
        onClick={() => onAddBulk(pack.habits)}
        className="w-full"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Add Entire Pack ({pack?.habits.length} habits)
      </Button>
    </div>
  );
}
