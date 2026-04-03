import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BADGES } from "../../constants/badges";

export default function BadgeToast({ newBadgeKey, onDone }) {
  const [visible, setVisible] = useState(false);
  const badge = BADGES.find((b) => b.key === newBadgeKey);

  useEffect(() => {
    if (!newBadgeKey) return;

    setVisible(true);

    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3500);

    return () => clearTimeout(t);
  }, [newBadgeKey, onDone]);

  if (!badge) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-[320px] max-w-[90vw]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:border-white/10 dark:bg-zinc-900/95">
            {/* glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[var(--color-primary)]/15 blur-2xl" />
            </div>

            <div className="relative flex items-center gap-4">
              {/* icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-2xl">
                {badge.icon}
              </div>

              {/* content */}
              <div className="min-w-0">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "var(--color-primary)" }}
                >
                  Achievement unlocked
                </p>

                <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-white">
                  {badge.label}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {badge.desc}
                </p>
              </div>
            </div>

            {/* progress bar timer */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
