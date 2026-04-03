import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MOODS } from "./MoodSelector";
import EditEntryModal from "./EditEntryModal";

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L8 20l-5 1 1-5 12.5-12.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4.75C8 4.34 8.34 4 8.75 4h6.5c.41 0 .75.34.75.75V6" />
      <path d="M19 6l-1 13.25c-.03.42-.38.75-.8.75H6.8c-.42 0-.77-.33-.8-.75L5 6" />
      <path d="M10 10.25v6.5" />
      <path d="M14 10.25v6.5" />
    </svg>
  );
}

function ActionIconButton({ onClick, label, children, danger = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
        danger
          ? "text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function JournalEntry({ entry, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);

  const mood = useMemo(
    () => MOODS.find((m) => m.value === entry.mood) || MOODS[2],
    [entry.mood],
  );

  const formattedDate = useMemo(() => {
    const d = new Date(entry.date + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [entry.date]);

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.26em]"
              style={{ color: "var(--color-primary)" }}
            >
              {formattedDate}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-2xl dark:bg-white/[0.06]">
                <span title={mood.label}>{mood.emoji}</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {mood.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Journal reflection
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <ActionIconButton
              label="Edit entry"
              onClick={() => setShowEdit(true)}
            >
              <EditIcon />
            </ActionIconButton>

            <ActionIconButton
              label="Delete entry"
              danger
              onClick={() => onDelete(entry._id)}
            >
              <TrashIcon />
            </ActionIconButton>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {entry.text}
          </p>
        </div>

        {entry.gratitude ? (
          <div className="mt-4 rounded-2xl border border-[rgba(var(--color-primary-rgb),0.18)] bg-[rgba(var(--color-primary-rgb),0.06)] px-4 py-3">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "var(--color-primary)" }}
            >
              Gratitude
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              ✦ {entry.gratitude}
            </p>
          </div>
        ) : null}
      </motion.div>

      <EditEntryModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        entry={entry}
        onUpdate={onUpdate}
      />
    </>
  );
}
