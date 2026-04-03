import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { CATEGORIES, FREQUENCIES, DAYS } from "../../constants/habits";

export default function EditTemplateModal({
  isOpen,
  onClose,
  template,
  onUpdate,
  categories = [],
}) {
  const [form, setForm] = useState({
    name: "",
    category: "health",
    frequency: "daily",
    customDays: [],
    routine: "none",
    description: "",
  });

  useEffect(() => {
    if (template)
      setForm({
        name: template.name || "",
        category: template.category || "health",
        frequency: template.frequency || "daily",
        customDays: template.customDays || [],
        routine: template.routine || "none",
        description: template.description || "",
      });
  }, [template]);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const toggleDay = (day) =>
    setForm((prev) => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter((d) => d !== day)
        : [...prev.customDays, day],
    }));

  const allCategories = [
    ...CATEGORIES,
    ...categories
      .map((c) => c.name.toLowerCase())
      .filter((n) => !CATEGORIES.includes(n)),
  ];

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    await onUpdate(template._id, form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="EDIT TEMPLATE">
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Template Name
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Description
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => set("category", cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                form.category === cat
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Frequency
        </label>
        <div className="flex gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              onClick={() => set("frequency", f.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                form.frequency === f.value
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {form.frequency === "custom" && (
          <div className="flex gap-2 mt-3">
            {DAYS.map((d) => (
              <button
                key={d.value}
                onClick={() => toggleDay(d.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  form.customDays.includes(d.value)
                    ? "bg-[var(--color-primary)] text-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Routine
        </label>
        <div className="flex gap-2">
          {[
            { value: "morning", label: "☀️ Morning" },
            { value: "night", label: "🌙 Night" },
            { value: "none", label: "None" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => set("routine", r.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                form.routine === r.value
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">
          Save Changes
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
