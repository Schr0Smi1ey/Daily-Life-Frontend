import Button from "./Button";
import { motion } from "framer-motion";

export default function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
  title,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-white px-6 py-14 text-center shadow-[0_10px_35px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/[0.03]">
      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* icon */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-3xl"
          style={{ color: "var(--color-primary)" }}
        >
          {icon}
        </motion.div>

        {/* title */}
        {title && (
          <h3 className="mb-1 text-base font-semibold text-zinc-900 dark:text-white">
            {title}
          </h3>
        )}

        {/* message */}
        <p className="mb-6 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>

        {/* action */}
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
