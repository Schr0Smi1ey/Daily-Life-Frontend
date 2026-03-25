import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function CheckinModal({ isOpen, onClose, habit, onCheckin }) {
  const [form, setForm] = useState({ note: "", wentWell: "", improve: "" });
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    await onCheckin(habit._id, { date: today, ...form });
    setForm({ note: "", wentWell: "", improve: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CHECK IN">
      <p className="text-zinc-400 text-sm mb-6">
        Logging <span className="text-white font-semibold">{habit?.name}</span>{" "}
        for today
      </p>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Note (optional)
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition"
          style={{ borderColor: "var(--color-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "")}
          placeholder="e.g. Ran 5km today"
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          What went well?
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition"
          style={{ borderColor: "var(--color-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "")}
          placeholder="e.g. Felt strong and energized"
          value={form.wentWell}
          onChange={(e) => set("wentWell", e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          What could improve?
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition"
          style={{ borderColor: "var(--color-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "")}
          placeholder="e.g. Start earlier next time"
          value={form.improve}
          onChange={(e) => set("improve", e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          className="flex-1"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Mark Done ✓
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
