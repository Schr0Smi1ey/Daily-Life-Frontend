import { motion } from "framer-motion";

export default function GoalStatusTabs({ active, onChange, counts }) {
  const tabs = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab.value;

        return (
          <motion.button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
              isActive
                ? "border-transparent text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
            }`}
            style={isActive ? { backgroundColor: "var(--color-primary)" } : {}}
          >
            <span>{tab.label}</span>

            {counts?.[tab.value] > 0 && (
              <span
                className={`text-[11px] font-semibold ${
                  isActive
                    ? "text-black/60"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {counts[tab.value]}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
