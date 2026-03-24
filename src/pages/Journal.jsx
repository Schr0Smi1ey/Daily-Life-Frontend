import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import JournalEntry from '../components/journal/JournalEntry'
import AddEntryModal from '../components/journal/AddEntryModal'
import useJournal from '../hooks/useJournal'

export default function Journal() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useJournal()
  const [showAdd, setShowAdd] = useState(false)

  const existingDates = entries.map(e => e.date)

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader title="JOURNAL" subtitle="Reflect, process, and grow.">
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + New Entry
        </Button>
      </PageHeader>

      {entries.length === 0 ? (
        <EmptyState
          icon="✎"
          message="No journal entries yet. Start reflecting today."
          actionLabel="Write First Entry"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <div>
          {entries.map(entry => (
            <JournalEntry
              key={entry._id}
              entry={entry}
              onDelete={deleteEntry}
              onUpdate={updateEntry}
            />
          ))}
        </div>
      )}

      <AddEntryModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createEntry}
        existingDates={existingDates}
      />
    </div>
  )
}
