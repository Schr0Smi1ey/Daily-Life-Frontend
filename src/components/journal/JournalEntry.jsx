import { useState } from "react";
import { MOODS } from "./MoodSelector";
import Button from "../ui/Button";
import EditEntryModal from "./EditEntryModal";

export default function JournalEntry({ entry, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);

  const mood = MOODS.find((m) => m.value === entry.mood) || MOODS[2];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 mb-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "var(--color-primary)" }}
            >
              {formatDate(entry.date)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl" title={mood.label}>
              {mood.emoji}
            </span>
            <button
              onClick={() => setShowEdit(true)}
              className="text-zinc-600 hover:text-white transition text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(entry._id)}
              className="text-zinc-700 hover:text-red-400 transition text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Text */}
        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
          {entry.text}
        </p>

        {/* Gratitude */}
        {entry.gratitude && (
          <div className="border-t border-white/5 pt-3">
            <p
              className="text-xs"
              style={{ color: "var(--color-primary)", opacity: 0.7 }}
            >
              ✦ {entry.gratitude}
            </p>
          </div>
        )}
      </div>

      <EditEntryModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        entry={entry}
        onUpdate={onUpdate}
      />
    </>
  );
}
