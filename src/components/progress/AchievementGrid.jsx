import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { BADGES } from "../../constants/badges";

export default function AchievementGrid({ unlocked = [] }) {
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {BADGES.map((badge, index) => {
        const achievement = unlocked.find((a) => a.badgeKey === badge.key);
        const isUnlocked = !!achievement;

        return (
          <motion.div
            key={badge.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`group relative overflow-hidden rounded-3xl border p-4 text-center transition-all ${
              isUnlocked
                ? "border-[rgba(var(--color-primary-rgb),0.26)] bg-white/85 shadow-[0_12px_30px_rgba(0,0,0,0.05)] dark:bg-white/[0.05] dark:shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
                : "border-zinc-200/70 bg-white/55 opacity-75 dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            {isUnlocked && (
              <>
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(var(--color-primary-rgb),0.18) 0%, rgba(var(--color-primary-rgb),0.04) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute right-3 top-3 rounded-full border border-[rgba(var(--color-primary-rgb),0.18)] bg-[rgba(var(--color-primary-rgb),0.08)] p-1.5 text-[var(--color-primary)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </>
            )}

            <div className="relative z-10">
              <div
                className={`mb-3 flex justify-center text-4xl transition-transform ${
                  isUnlocked ? "group-hover:scale-110" : "grayscale"
                }`}
              >
                {badge.icon}
              </div>

              <p
                className={`mb-1 text-sm font-semibold tracking-tight ${
                  isUnlocked
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {badge.label}
              </p>

              <p
                className={`mb-3 text-xs leading-relaxed ${
                  isUnlocked
                    ? "text-zinc-500"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {badge.desc}
              </p>

              {isUnlocked && achievement.unlockedAt ? (
                <div className="inline-flex items-center rounded-full border border-[rgba(var(--color-primary-rgb),0.18)] bg-[rgba(var(--color-primary-rgb),0.08)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]">
                  {formatDate(achievement.unlockedAt)}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                  <Lock className="h-3 w-3" />
                  Locked
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
