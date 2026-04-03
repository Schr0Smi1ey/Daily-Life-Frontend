const DEFAULT_STYLES = {
  health: { bg: "#22c55e25", color: "#22c55e" },
  fitness: { bg: "#ef444425", color: "#ef4444" },
  learning: { bg: "#3b82f625", color: "#3b82f6" },
  mindfulness: { bg: "#a855f725", color: "#a855f7" },
  productivity: { bg: "#f9731625", color: "#f97316" },
  general: { bg: "#71717a25", color: "#71717a" },
};

export default function Badge({ category, customColor }) {
  const defaultStyle = DEFAULT_STYLES[category?.toLowerCase()];

  const bg = customColor ? `${customColor}25` : defaultStyle?.bg || "#71717a25";
  const color = customColor ? customColor : defaultStyle?.color || "#71717a";

  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
      style={{ background: bg, color }}
    >
      {category || "general"}
    </span>
  );
}
