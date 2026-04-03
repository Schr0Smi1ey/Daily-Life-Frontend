import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import MoodSelector from "./MoodSelector";

const initialForm = {
  mood: 3,
  text: "",
  gratitude: "",
};

export default function AddEntryModal({
  isOpen,
  onClose,
  onCreate,
  existingDates = [],
}) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const alreadyToday = existingDates.includes(today);

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const canSubmit = form.text.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      await onCreate({
        ...form,
        text: form.text.trim(),
        gratitude: form.gratitude.trim(),
        date: today,
      });
      setForm(initialForm);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName =
    "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEW ENTRY">
      <div className="space-y-6">
        <AnimatePresence>
          {alreadyToday && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-[rgba(var(--color-primary-rgb),0.22)] bg-[rgba(var(--color-primary-rgb),0.08)] px-4 py-3"
            >
              <p className="text-xs leading-relaxed text-[var(--color-primary)]">
                You already have an entry for today. Creating another one will
                be saved separately.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
        >
          <label className="mb-3 block text-xs uppercase tracking-widest text-zinc-500">
            How are you feeling?
          </label>
          <MoodSelector
            value={form.mood}
            onChange={(value) => setField("mood", value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-500">
            What&apos;s on your mind?
          </label>
          <textarea
            rows={6}
            className={`${fieldClassName} resize-none`}
            placeholder="Reflect on your day, wins, challenges, lessons..."
            value={form.text}
            onChange={(e) => setField("text", e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-500">
            One thing you&apos;re grateful for
          </label>
          <input
            className={fieldClassName}
            placeholder="Today I’m grateful for..."
            value={form.gratitude}
            onChange={(e) => setField("gratitude", e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="flex gap-3"
        >
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!canSubmit}
            loading={isSubmitting}
          >
            Save Entry
          </Button>

          <Button onClick={onClose} variant="ghost" disabled={isSubmitting}>
            Cancel
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
