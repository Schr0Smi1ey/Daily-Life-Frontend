import { motion } from "framer-motion";

export default function StatCard({
  label,
  value,
  sub,
  accent = false,
  icon = null,
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`group relative overflow-hidden rounded-3xl border p-5 md:p-6 transition-all duration-300 ${
        accent
          ? "border-transparent text-black shadow-[0_18px_50px_rgba(var(--color-primary-rgb),0.28)]"
          : "border-zinc-200/70 bg-white/80 text-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)]"
      }`}
      style={accent ? { backgroundColor: "var(--color-primary)" } : undefined}
    >
      {/* ambient glow */}
      {accent ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_40%,transparent)]" />
          <motion.div
            initial={{ opacity: 0.18, x: 0 }}
            whileHover={{ opacity: 0.28, x: 10 }}
            transition={{ duration: 0.35 }}
            className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl"
          />
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(var(--color-primary-rgb),0.18) 0%, rgba(var(--color-primary-rgb),0.02) 60%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_40%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%)]" />
        </>
      )}

      <div className="relative z-10">
        {/* header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
              accent ? "text-black/65" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {label}
          </p>

          {icon && (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
                accent
                  ? "border-black/10 bg-black/10 text-black"
                  : "border-zinc-200/80 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300"
              }`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* value */}
        <motion.p
          initial={{ opacity: 0.9, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`text-3xl font-semibold tracking-tight md:text-4xl ${
            accent ? "text-black" : "text-zinc-950 dark:text-white"
          }`}
        >
          {value}
        </motion.p>

        {/* subtext */}
        {sub && (
          <p
            className={`mt-2 text-xs ${
              accent ? "text-black/65" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}
