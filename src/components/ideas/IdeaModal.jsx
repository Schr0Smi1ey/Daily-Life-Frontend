import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

function IdeaModal({ isOpen, onClose, onSubmit, initial, categories }) {
  const isEdit = !!initial;

  const defaultCategory = useMemo(() => {
    if (initial?.category) return initial.category;
    if (categories?.some((c) => c.name === "Uncategorized")) {
      return "Uncategorized";
    }
    return categories?.[0]?.name || "Uncategorized";
  }, [initial, categories]);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initial?.title || "");
      setDetails(initial?.details?.join("\n") || "");
      setCategory(
        initial?.category ||
          (categories?.[0]?.name === "Uncategorized"
            ? "Uncategorized"
            : categories?.[0]?.name || "Uncategorized"),
      );
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen, initial, categories]);

  const reset = () => {
    setTitle("");
    setDetails("");
    setCategory(defaultCategory);
    setError("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const detailLines = details
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        details: detailLines,
        category,
      });
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName =
    "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Idea" : "New Idea"}
    >
      <div className="space-y-5">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3"
            >
              <p className="text-xs font-medium text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
        >
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-500">
            Title
          </label>
          <input
            className={fieldClassName}
            placeholder="e.g. Habit app gamification"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            autoFocus
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <label className="mb-1 block text-xs uppercase tracking-widest text-zinc-500">
            Details{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <p className="mb-2 text-xs text-zinc-500">
            One bullet point or thought per line
          </p>
          <textarea
            rows={5}
            className={`${fieldClassName} resize-none`}
            placeholder={"Add XP system\nWeekly challenges\nReward loops"}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="mb-2 block text-xs uppercase tracking-widest text-zinc-500">
            Category
          </label>

          {categories?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = category === cat.name;

                return (
                  <motion.button
                    key={cat._id}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setCategory(cat.name)}
                    className="rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all"
                    style={
                      isActive
                        ? {
                            background: cat.color,
                            color: "#000",
                            boxShadow: `0 8px 20px ${cat.color}30`,
                          }
                        : {
                            background: `${cat.color}15`,
                            color: cat.color,
                            border: `1px solid ${cat.color}35`,
                          }
                    }
                  >
                    {cat.name}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              No categories yet. Create one from the Categories manager.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="flex gap-3 pt-1"
        >
          <Button
            onClick={handleSubmit}
            className="flex-1"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? "Save Changes" : "Capture Idea"}
          </Button>

          <Button onClick={handleClose} variant="ghost" disabled={isSubmitting}>
            Cancel
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

export default IdeaModal;
