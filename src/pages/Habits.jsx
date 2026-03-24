import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import HabitGroup from '../components/habits/HabitGroup'
import AddHabitModal from '../components/habits/AddHabitModal'
import StreakCalendar from '../components/habits/StreakCalendar'
import HabitTemplates from '../components/habits/HabitTemplates'
import ConfettiBlast from '../components/ui/ConfettiBlast'
import useHabits from '../hooks/useHabits'

export default function Habits() {
  const {
    habits, loading,
    createHabit, deleteHabit,
    checkin, undoCheckin,
    fetchTemplates, addBulkHabits
  } = useHabits()

  const [showAdd,       setShowAdd]       = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const allDoneToday = habits.length > 0 &&
    habits.every(h => h.checkins?.some(c => c.date === today))

  const morning = habits.filter(h => h.routine === 'morning')
  const night   = habits.filter(h => h.routine === 'night')
  const general = habits.filter(h => h.routine === 'none')

  const handleAddSingle = async (h) => {
    await createHabit(h)
    setShowTemplates(false)
  }

  const handleAddBulk = async (habits) => {
    await addBulkHabits(habits)
    setShowTemplates(false)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <ConfettiBlast trigger={allDoneToday} />

      <PageHeader title="HABITS" subtitle="Build consistency. Check in daily.">
        <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)}>
          Templates
        </Button>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + New Habit
        </Button>
      </PageHeader>

      {habits.length === 0 ? (
        <EmptyState
          icon="◎"
          message="No habits yet. Start with a template or create your own."
          actionLabel="Browse Templates"
          onAction={() => setShowTemplates(true)}
        />
      ) : (
        <>
          <HabitGroup
            title="Morning Routine"
            icon="☀️"
            habits={morning}
            onCheckin={checkin}
            onUndoCheckin={undoCheckin}
            onDelete={deleteHabit}
          />
          <HabitGroup
            title="Night Routine"
            icon="🌙"
            habits={night}
            onCheckin={checkin}
            onUndoCheckin={undoCheckin}
            onDelete={deleteHabit}
          />
          <HabitGroup
            title="All Habits"
            icon="◎"
            habits={general}
            onCheckin={checkin}
            onUndoCheckin={undoCheckin}
            onDelete={deleteHabit}
          />

          {/* Streak Calendar */}
          <div className="mt-8 bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
              Last 12 Weeks
            </h3>
            <StreakCalendar habits={habits} />
          </div>
        </>
      )}

      {/* Modals */}
      <AddHabitModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createHabit}
      />

      <Modal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        title="HABIT TEMPLATES"
      >
        <HabitTemplates
          fetchTemplates={fetchTemplates}
          onAddBulk={handleAddBulk}
          onAddSingle={handleAddSingle}
        />
      </Modal>
    </div>
  )
}
