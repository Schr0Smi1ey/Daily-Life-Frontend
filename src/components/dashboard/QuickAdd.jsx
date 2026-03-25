import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function QuickAdd({ onNewJournal }) {
  const navigate = useNavigate();

  const actions = [
    { label: "+ Add Habit", icon: "◎", onClick: () => navigate("/habits") },
    { label: "+ Set Goal", icon: "◈", onClick: () => navigate("/goals") },
    { label: "+ Journal Entry", icon: "✎", onClick: onNewJournal },
    {
      label: "↗ View Progress",
      icon: "↗",
      onClick: () => navigate("/progress"),
    },
  ];

  // Track hover state per button
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <button
          key={action.label}
          onClick={action.onClick}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400 transition"
          style={{
            borderColor:
              hovered === index
                ? "var(--color-primary)"
                : "rgba(255,255,255,0.1)",
            backgroundColor:
              hovered === index
                ? "rgba(var(--color-primary-rgb), 0.05)"
                : "transparent",
            color: hovered === index ? "white" : undefined,
          }}
        >
          <span className="text-base">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
