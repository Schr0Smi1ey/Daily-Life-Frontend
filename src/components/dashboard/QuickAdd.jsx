import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ActionButton({ icon, label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-[0_8px_25px_rgba(0,0,0,0.05)] transition-all duration-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:text-white"
    >
      {/* subtle glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[var(--color-primary)]/10" />
      </div>

      {/* icon */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-base dark:bg-white/10">
        {icon}
      </div>

      {/* label */}
      <span className="relative">{label}</span>

      {/* right arrow hint */}
      <span className="ml-auto text-xs opacity-0 transition group-hover:opacity-100">
        →
      </span>
    </motion.button>
  );
}

export default function QuickAdd({ onNewJournal }) {
  const navigate = useNavigate();

  const actions = [
    { label: "Add Habit", icon: "◎", onClick: () => navigate("/habits") },
    { label: "Set Goal", icon: "◈", onClick: () => navigate("/goals") },
    { label: "Journal Entry", icon: "✎", onClick: onNewJournal },
    { label: "View Progress", icon: "↗", onClick: () => navigate("/progress") },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map((action) => (
        <ActionButton key={action.label} {...action} />
      ))}
    </div>
  );
}
