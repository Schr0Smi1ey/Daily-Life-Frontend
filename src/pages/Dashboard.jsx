import { useState } from 'react'
import DailyGreeting      from '../components/dashboard/DailyGreeting'
import DailyQuote         from '../components/dashboard/DailyQuote'
import ConsistencyScore   from '../components/dashboard/ConsistencyScore'
import HabitSnapshot      from '../components/dashboard/HabitSnapshot'
import ActiveGoalsSummary from '../components/dashboard/ActiveGoalsSummary'
import QuickAdd           from '../components/dashboard/QuickAdd'
import StatCard           from '../components/ui/StatCard'
import Spinner            from '../components/ui/Spinner'
import BadgeToast from '../components/ui/BadgeToast'
import AddEntryModal      from '../components/journal/AddEntryModal'
import useHabits          from '../hooks/useHabits'
import useGoals           from '../hooks/useGoals'
import useProgress        from '../hooks/useProgress'
import useJournal         from '../hooks/useJournal'
import useAchievements         from '../hooks/useAchievements'
import useAchievementChecker   from '../hooks/useAchievementChecker'

export default function Dashboard() {
  const { habits,  loading: lh } = useHabits()
  const { goals,   loading: lg } = useGoals()
  const { weekly,  loading: lp } = useProgress()
  const { entries, createEntry, loading: lj } = useJournal()
  const { unlocked, unlock, newBadgeKey, clearNewBadge } = useAchievements()

  const [showJournal, setShowJournal] = useState(false)

  // ── Auto-check and unlock achievements ──────────────────────────────────
  useAchievementChecker({ habits, goals, entries, unlocked, unlock })

  if (lh || lg || lp || lj) return <Spinner />

  const today    = new Date().toISOString().split('T')[0]

  const bestStreak = habits.reduce((max, h) => {
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      if (h.checkins?.some(c => c.date === key)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (streak === 0) {
        d.setDate(d.getDate() - 1)
        const prev = d.toISOString().split('T')[0]
        if (!h.checkins?.some(c => c.date === prev)) break
      } else break
    }
    return Math.max(max, streak)
  }, 0)

  return (
    <div>
      <DailyGreeting />
      <DailyQuote />

      <div className="mb-8">
        <QuickAdd onNewJournal={() => setShowJournal(true)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today"
          value={`${habits.filter(h => h.checkins?.some(c => c.date === today)).length}/${habits.length}`}
          sub="Habits done"
          accent
        />
        <StatCard
          label="Best Streak"
          value={bestStreak > 0 ? `${bestStreak}🔥` : '—'}
          sub="Days in a row"
        />
        <StatCard
          label="Active Goals"
          value={goals.filter(g => g.status === 'active').length}
          sub="In progress"
        />
        <StatCard
          label="Journal"
          value={entries.length}
          sub="Total entries"
        />
      </div>

      <div className="mb-6">
        <ConsistencyScore score={weekly?.overallScore ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <HabitSnapshot habits={habits} />
        <ActiveGoalsSummary goals={goals} />
      </div>

      <AddEntryModal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        onCreate={createEntry}
        existingDates={entries.map(e => e.date)}
      />
      <BadgeToast newBadgeKey={newBadgeKey} onDone={clearNewBadge} />
    </div>
  )
}