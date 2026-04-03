import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { CATEGORIES } from "../../constants/habits";
import { ChevronDown, Plus } from "lucide-react";

const emptyHabit = () => ({
  name: "",
  category: "general",
  frequency: "daily",
  routine: "none",
});

const fieldClass =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

function SelectField({ value, onChange, children }) {
  return (
    <div className="relative flex-1">
      <select
        className={`${fieldClass} pr-10`}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
    </div>
  );
}

export default function AddTemplateModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [habits, setHabits] = useState([emptyHabit()]);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setDesc("");
    setHabits([emptyHabit()]);
    setError("");
  };

  const setHabit = (i, key, val) =>
    setHabits((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [key]: val } : h)),
    );

  const addHabit = () => setHabits((prev) => [...prev, emptyHabit()]);
  const removeHabit = (i) =>
    setHabits((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!name.trim()) return setError("Template name is required.");
    const validHabits = habits.filter((h) => h.name.trim());
    if (!validHabits.length) return setError("Add at least one habit.");
    await onCreate({ name, description: desc, habits: validHabits });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="New Template"
    >
      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3"
        >
          <p className="text-xs text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Name */}
      <div className="mb-4">
        <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
          Template Name
        </label>
        <input
          className={fieldClass}
          placeholder="e.g. Evening Wind Down"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
          Description
        </label>
        <input
          className={fieldClass}
          placeholder="What is this pack about?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* Habits */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-widest text-zinc-500">
            Habits
          </label>

          <Button size="sm" variant="ghost" onClick={addHabit}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {habits.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-zinc-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
            >
              {/* Name */}
              <div className="flex gap-2 mb-3">
                <input
                  className={fieldClass}
                  placeholder="Habit name"
                  value={h.name}
                  onChange={(e) => setHabit(i, "name", e.target.value)}
                />

                {habits.length > 1 && (
                  <button
                    onClick={() => removeHabit(i)}
                    className="text-zinc-400 hover:text-red-400 text-sm px-2"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Selects */}
              <div className="flex flex-col md:flex-row gap-2">
                <SelectField
                  value={h.category}
                  onChange={(e) => setHabit(i, "category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  value={h.frequency}
                  onChange={(e) => setHabit(i, "frequency", e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                </SelectField>

                <SelectField
                  value={h.routine}
                  onChange={(e) => setHabit(i, "routine", e.target.value)}
                >
                  <option value="none">No Routine</option>
                  <option value="morning">☀️ Morning</option>
                  <option value="night">🌙 Night</option>
                </SelectField>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">
          Create Template
        </Button>
        <Button
          onClick={() => {
            reset();
            onClose();
          }}
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
