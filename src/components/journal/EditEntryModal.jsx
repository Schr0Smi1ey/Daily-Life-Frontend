import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import MoodSelector from "./MoodSelector";

export default function EditEntryModal({ isOpen, onClose, entry, onUpdate }) {
  const [form, setForm] = useState({
    mood: 3,
    text: "",
    gratitude: "",
  });

  useEffect(() => {
    if (entry) {
      setForm({
        mood: entry.mood || 3,
        text: entry.text || "",
        gratitude: entry.gratitude || "",
      });
    }
  }, [entry]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.text.trim() || !entry?._id) return;

    await onUpdate(entry._id, {
      ...form,
      text: form.text.trim(),
      gratitude: form.gratitude.trim(),
    });

    onClose();
  };

  const fieldClassName =
    "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Entry">
      <div className="space-y-5">
        <div>
          <label className="mb-3 block text-xs uppercase tracking-widest text-zinc-500">
            How are you feeling?
          </label>
          <MoodSelector
            value={form.mood}
            onChange={(val) => set("mood", val)}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-500">
            What&apos;s on your mind?
          </label>
          <textarea
            rows={5}
            className={`${fieldClassName} resize-none`}
            placeholder="Reflect on your day, wins, challenges, lessons..."
            value={form.text}
            onChange={(e) => set("text", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-500">
            One thing you&apos;re grateful for
          </label>
          <input
            className={fieldClassName}
            placeholder="Today I’m grateful for..."
            value={form.gratitude}
            onChange={(e) => set("gratitude", e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button onClick={handleSubmit} className="flex-1">
            Save Changes
          </Button>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
