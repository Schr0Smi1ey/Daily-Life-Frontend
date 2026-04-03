const PRESETS = [
  "#f97316",
  "#ef4444",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#06b6d4",
  "#84cc16",
  "#a78bfa",
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div>
      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-7 h-7 rounded-full border-2 transition hover:scale-110"
            style={{
              background: c,
              borderColor: value === c ? "white" : "transparent",
            }}
          />
        ))}
      </div>
      {/* Custom picker */}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border border-white/10 bg-zinc-800 cursor-pointer"
        />
        <span className="text-zinc-400 text-sm font-mono">{value}</span>
      </div>
    </div>
  );
}
