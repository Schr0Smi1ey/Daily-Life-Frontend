import { motion } from "framer-motion";

const COLOR_MAP = {
  primary: "bg-[var(--color-primary)]",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
};

function clamp(value) {
  return Math.min(100, Math.max(0, value));
}

export default function ProgressBar({
  value = 0,
  color = "primary",
  height = "h-2.5",
  showLabel = false,
  animated = true,
}) {
  const safeValue = clamp(value);
  const barColor = COLOR_MAP[color] || COLOR_MAP.primary;

  return (
    <div className="group w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          <span>Progress</span>
          <span className="font-semibold tracking-normal normal-case text-zinc-700 dark:text-zinc-300">
            {safeValue}%
          </span>
        </div>
      )}

      <div
        className={`relative w-full overflow-hidden rounded-full border border-zinc-200/70 bg-zinc-100 dark:border-white/10 dark:bg-white/[0.06] ${height}`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className="absolute inset-0 blur-md"
            style={{
              background:
                color === "primary"
                  ? "rgba(var(--color-primary-rgb),0.12)"
                  : undefined,
            }}
          />
        </div>

        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeValue}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${barColor} ${height} relative rounded-full`}
          >
            <div className="absolute inset-0 rounded-full bg-white/10" />
          </motion.div>
        ) : (
          <div
            className={`${barColor} ${height} relative rounded-full`}
            style={{ width: `${safeValue}%` }}
          >
            <div className="absolute inset-0 rounded-full bg-white/10" />
          </div>
        )}
      </div>
    </div>
  );
}
