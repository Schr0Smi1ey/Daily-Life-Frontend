import { motion, AnimatePresence } from "framer-motion";

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4.75C8 4.34 8.34 4 8.75 4h6.5c.41 0 .75.34.75.75V6" />
      <path d="M19 6l-1 13.25c-.03.42-.38.75-.8.75H6.8c-.42 0-.77-.33-.8-.75L5 6" />
      <path d="M10 10.25v6.5" />
      <path d="M14 10.25v6.5" />
    </svg>
  );
}

export default function MilestoneItem({ milestone, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
    >
      {/* Toggle */}
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.85 }}
        className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
      >
        <motion.span
          className={`absolute inset-0 rounded-full border-2 transition ${
            milestone.done
              ? "border-green-500 bg-green-500"
              : "border-zinc-300 dark:border-white/20"
          }`}
          animate={
            milestone.done
              ? {
                  boxShadow: [
                    "0 0 0 rgba(34,197,94,0)",
                    "0 0 0 6px rgba(34,197,94,0.18)",
                    "0 0 0 rgba(34,197,94,0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.35 }}
        />

        <AnimatePresence>
          {milestone.done && (
            <motion.span
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              className="relative z-10 text-xs font-bold text-white"
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            milestone.done
              ? "line-through text-zinc-500"
              : "text-zinc-900 dark:text-white"
          }`}
        >
          {milestone.text}
        </p>

        {milestone.doneAt && (
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Completed on {milestone.doneAt}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
      >
        <TrashIcon />
      </button>
    </motion.div>
  );
}
