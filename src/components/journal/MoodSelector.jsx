import { motion } from "framer-motion";

const MOODS = [
  { value: 1, emoji: "😔", label: "Rough" },
  { value: 2, emoji: "😐", label: "Meh" },
  { value: 3, emoji: "🙂", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🔥", label: "Amazing" },
];

export { MOODS };

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MOODS.map((mood) => {
        const isActive = value === mood.value;

        return (
          <motion.button
            key={mood.value}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => onChange(mood.value)}
            className={`
              flex flex-col items-center justify-center gap-1.5
              rounded-2xl border px-2 py-3 transition-all
              ${
                isActive
                  ? "border-[rgba(var(--color-primary-rgb),0.35)] bg-[rgba(var(--color-primary-rgb),0.12)] shadow-[0_0_0_1px_rgba(var(--color-primary-rgb),0.12)]"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
              }
            `}
          >
            <span
              className={`
                text-xl transition-all
                ${isActive ? "scale-110" : "opacity-80"}
              `}
            >
              {mood.emoji}
            </span>

            <span
              className={`
                text-[11px] leading-none transition
                ${
                  isActive
                    ? "font-medium text-[var(--color-primary)]"
                    : "text-zinc-500"
                }
              `}
            >
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
