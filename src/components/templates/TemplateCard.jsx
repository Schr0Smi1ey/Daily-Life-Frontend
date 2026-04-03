import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function TemplateCard({
  template,
  categories = [],
  onEdit,
  onDelete,
  onDuplicate,
  onAddHabit,
}) {
  const customCat = categories.find(
    (c) => c.name.toLowerCase() === template.category?.toLowerCase(),
  );

  const freqLabel =
    {
      daily: "Every day",
      weekdays: "Weekdays",
      custom: template.customDays?.length
        ? `${template.customDays.length} days/week`
        : "Custom",
    }[template.frequency] || template.frequency;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 group hover:border-white/20 transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-white font-bold text-base">{template.name}</h3>
          {template.description && (
            <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">
              {template.description}
            </p>
          )}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
          <button
            onClick={() => onDuplicate(template._id)}
            title="Duplicate"
            className="text-zinc-600 hover:text-white text-xs transition p-1.5 rounded-lg hover:bg-zinc-800"
          >
            ⧉
          </button>
          <button
            onClick={() => onEdit(template)}
            className="text-zinc-600 hover:text-white text-xs transition p-1.5 rounded-lg hover:bg-zinc-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(template._id)}
            className="text-zinc-700 hover:text-red-400 text-xs transition p-1.5 rounded-lg hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <Badge category={template.category} customColor={customCat?.color} />
        <span className="text-xs text-zinc-600 bg-zinc-800 px-2.5 py-0.5 rounded-full">
          {freqLabel}
        </span>
        {template.routine !== "none" && (
          <span className="text-xs text-zinc-600 bg-zinc-800 px-2.5 py-0.5 rounded-full">
            {template.routine === "morning" ? "☀️ Morning" : "🌙 Night"}
          </span>
        )}
      </div>

      {/* Add habit button */}
      <Button size="sm" onClick={() => onAddHabit(template)} className="w-full">
        + Add as Habit
      </Button>
    </div>
  );
}
