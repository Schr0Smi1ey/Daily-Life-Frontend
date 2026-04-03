import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const QUICK_DAYS = [7, 14, 21, 30, 60, 90];

export default function AddGoalModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1); // 1 = type, 2 = details
  const [goalType, setGoalType] = useState("non-numerical");
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDays: 30,
    startDate: "",
    totalTarget: "",
    unit: "",
  });
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const reset = () => {
    setStep(1);
    setGoalType("non-numerical");
    setForm({
      title: "",
      description: "",
      targetDays: 30,
      startDate: "",
      totalTarget: "",
      unit: "",
    });
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (goalType === "numerical") {
      if (!form.totalTarget || Number(form.totalTarget) <= 0)
        return setError("Total target must be a positive number.");
      if (!form.unit.trim())
        return setError("Unit is required (e.g. problems, km, pages).");
    }

    await onCreate({
      ...form,
      goalType,
      startDate: form.startDate || today,
      targetDays: Number(form.targetDays),
      totalTarget: goalType === "numerical" ? Number(form.totalTarget) : null,
    });

    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="NEW GOAL">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Step 1 — Goal Type */}
      {step === 1 && (
        <div>
          <p className="text-zinc-400 text-sm mb-5">
            What kind of goal is this?
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {/* Non-numerical */}
            <button
              onClick={() => setGoalType("non-numerical")}
              className={`text-left p-4 rounded-2xl border transition ${
                goalType === "non-numerical"
                  ? "border-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.08)]"
                  : "border-white/10 bg-zinc-800 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">📅</span>
                <p className="text-white font-bold text-sm">Daily Habit Goal</p>
                {goalType === "non-numerical" && (
                  <span className="ml-auto text-[var(--color-primary)] text-xs font-bold">
                    ✓ Selected
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-xs ml-8">
                Show up every day. Progress = days completed.
              </p>
              <p className="text-zinc-600 text-xs ml-8 mt-1 italic">
                e.g. "Practice Guitar for 30 days"
              </p>
            </button>

            {/* Numerical */}
            <button
              onClick={() => setGoalType("numerical")}
              className={`text-left p-4 rounded-2xl border transition ${
                goalType === "numerical"
                  ? "border-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.08)]"
                  : "border-white/10 bg-zinc-800 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">🔢</span>
                <p className="text-white font-bold text-sm">
                  Numerical Target Goal
                </p>
                {goalType === "numerical" && (
                  <span className="ml-auto text-[var(--color-primary)] text-xs font-bold">
                    ✓ Selected
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-xs ml-8">
                Hit a number. Daily targets auto-distributed.
              </p>
              <p className="text-zinc-600 text-xs ml-8 mt-1 italic">
                e.g. "Solve 100 problems in 30 days"
              </p>
            </button>
          </div>

          <Button onClick={() => setStep(2)} className="w-full">
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 2 && (
        <div>
          {/* Goal type badge */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setStep(1)}
              className="text-zinc-600 hover:text-white text-xs transition"
            >
              ← Back
            </button>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: "rgba(var(--color-primary-rgb), 0.15)",
                color: "var(--color-primary)",
              }}
            >
              {goalType === "numerical" ? "🔢 Numerical" : "📅 Daily Habit"}
            </span>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              Goal Title
            </label>
            <input
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
              placeholder={
                goalType === "numerical"
                  ? "e.g. Solve 100 LeetCode problems"
                  : "e.g. Practice Guitar every day"
              }
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Numerical fields */}
          {goalType === "numerical" && (
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
                  Total Target
                </label>
                <input
                  type="number"
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
                  placeholder="e.g. 100"
                  value={form.totalTarget}
                  onChange={(e) => {
                    set("totalTarget", e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
                  Unit
                </label>
                <input
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
                  placeholder="e.g. problems"
                  value={form.unit}
                  onChange={(e) => {
                    set("unit", e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              Description <span className="text-zinc-700">(optional)</span>
            </label>
            <input
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
              placeholder="What does success look like?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Target Days */}
          <div className="mb-4">
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              Duration
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {QUICK_DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => set("targetDays", d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    Number(form.targetDays) === d
                      ? "bg-[var(--color-primary)] text-black"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
            <input
              type="number"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
              placeholder="Or type custom days"
              value={form.targetDays}
              onChange={(e) => set("targetDays", e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div className="mb-5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
              value={form.startDate || today}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>

          {/* Preview for numerical */}
          {goalType === "numerical" && form.totalTarget && form.targetDays && (
            <div className="bg-zinc-800 rounded-xl px-4 py-3 mb-5">
              <p className="text-zinc-400 text-xs mb-1">
                Daily target preview:
              </p>
              <p className="text-white text-sm font-semibold">
                ~{Math.ceil(Number(form.totalTarget) / Number(form.targetDays))}{" "}
                {form.unit || "units"} per day
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                Auto-distributed across {form.targetDays} days. You can override
                any day later.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1">
              Create Goal
            </Button>
            <Button onClick={handleClose} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
