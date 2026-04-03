import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import JournalEntry from "../components/journal/JournalEntry";
import AddEntryModal from "../components/journal/AddEntryModal";
import useJournal from "../hooks/useJournal";

function SectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6">
      {(title || subtitle || actions) && (
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {subtitle}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      )}

      {children}
    </section>
  );
}

function JournalList({ entries, onDelete, onUpdate }) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry, index) => (
          <motion.div
            key={entry._id}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <JournalEntry
              entry={entry}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Journal() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } =
    useJournal();
  const [showAdd, setShowAdd] = useState(false);

  const existingDates = useMemo(
    () => entries.map((entry) => entry.date),
    [entries],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <PageHeader
          title="Journal"
          subtitle="Reflect, process, and capture the thoughts that shape your growth."
        >
          <Button size="sm" onClick={() => setShowAdd(true)}>
            + New Entry
          </Button>
        </PageHeader>

        {entries.length === 0 ? (
          <EmptyState
            icon="✎"
            title="No journal entries yet"
            message="Start reflecting today and build a meaningful record of your thoughts."
            actionLabel="Write First Entry"
            onAction={() => setShowAdd(true)}
          />
        ) : (
          <SectionCard
            title="Your entries"
            subtitle="A timeline of reflections, ideas, and personal notes."
            actions={
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </div>
            }
          >
            <JournalList
              entries={entries}
              onDelete={deleteEntry}
              onUpdate={updateEntry}
            />
          </SectionCard>
        )}
      </div>

      <AddEntryModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createEntry}
        existingDates={existingDates}
      />
    </>
  );
}
