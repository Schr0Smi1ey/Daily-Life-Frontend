import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function IdeaCard({
  idea,
  categories,
  onEdit,
  onDelete,
  onArchive,
  onToggleFavorite,
  onTogglePin,
}) {
  const [expanded, setExpanded] = useState(false);

  const cat = categories.find(
    (c) => c.name.toLowerCase() === idea.category?.toLowerCase(),
  );

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const isPinned = idea.pinned;

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="group rounded-3xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)]"
      style={
        isPinned
          ? {
              borderColor: "rgba(var(--color-primary-rgb),0.28)",
              boxShadow:
                "0 0 0 1px rgba(var(--color-primary-rgb),0.12), 0 10px 30px rgba(0,0,0,0.06)",
            }
          : undefined
      }
    >
      {/* Header */}
      <div
        className="flex items-start gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {/* Icon block */}
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 text-base dark:border-white/10 dark:bg-white/[0.03]">
          {isPinned ? "📌" : "💡"}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            {idea.title}
          </h3>

          {/* Preview */}
          {!expanded && idea.details?.length > 0 && (
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
              {idea.details
                .slice(0, 2)
                .map((d) => `• ${d}`)
                .join("  ")}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {cat && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: `${cat.color}15`,
                  color: cat.color,
                  border: `1px solid ${cat.color}30`,
                }}
              >
                {idea.category}
              </span>
            )}

            <span className="text-[11px] text-zinc-500">
              {formatDate(idea.createdAt)}
            </span>

            {idea.favorite && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
                Favorite
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(idea._id, idea.favorite);
            }}
            className={`p-2 rounded-xl border text-xs transition ${
              idea.favorite
                ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                : "border-zinc-200 text-zinc-500 hover:text-yellow-400 dark:border-white/10"
            }`}
          >
            ⭐
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(idea._id, idea.pinned);
            }}
            className="p-2 rounded-xl border border-zinc-200 text-zinc-500 dark:border-white/10"
            style={idea.pinned ? { color: "var(--color-primary)" } : undefined}
          >
            📌
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(idea);
            }}
            className="px-2.5 py-2 text-xs rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 dark:border-white/10 dark:hover:text-white"
          >
            Edit
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onArchive(idea._id);
            }}
            className="px-2.5 py-2 text-xs rounded-xl border border-zinc-200 text-zinc-500 dark:border-white/10"
          >
            Archive
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(idea._id);
            }}
            className="px-2.5 py-2 text-xs rounded-xl border border-red-500/20 text-zinc-500 hover:text-red-400 hover:border-red-500/40"
          >
            Delete
          </motion.button>
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence initial={false}>
        {expanded && idea.details?.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 border-t border-zinc-200/60 dark:border-white/10">
              <ul className="flex flex-col gap-2">
                {idea.details.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300"
                  >
                    <span
                      className="mt-1 text-[10px]"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ●
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default IdeaCard;
