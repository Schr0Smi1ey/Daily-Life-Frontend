import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function ModalHeader({ title, onClose, subtitle }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="h-px w-10 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
            Dialog
          </span>
        </div>

        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-md",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative w-full ${maxWidth} overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-zinc-900/95 md:p-7`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl bg-[rgba(var(--color-primary-rgb),0.14)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />
            </div>

            <div className="relative">
              <ModalHeader
                title={title}
                subtitle={subtitle}
                onClose={onClose}
              />
              <div>{children}</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
