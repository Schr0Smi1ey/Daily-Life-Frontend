import PageHeader      from '../components/layout/PageHeader'
import StatCard        from '../components/ui/StatCard'
import Spinner         from '../components/ui/Spinner'
import WeeklyChart     from '../components/progress/WeeklyChart'
import HabitBreakdown  from '../components/progress/HabitBreakdown'
import StreakList       from '../components/progress/StreakList'
import WeeklyReportCard from '../components/progress/WeeklyReportCard'
import AchievementGrid  from '../components/progress/AchievementGrid'
import useProgress     from '../hooks/useProgress'
import useAchievements from '../hooks/useAchievements'

export default function Progress() {
  const { weekly, streaks, report, loading } = useProgress()
  const { unlocked } = useAchievements()

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader title="PROGRESS" subtitle="Your numbers. Your story." />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Overall Score"
          value={`${weekly?.overallScore ?? 0}%`}
          sub="This week"
          accent
        />
        <StatCard
          label="Habits Tracked"
          value={weekly?.habits?.length ?? 0}
          sub="Active habits"
        />
        <StatCard
          label="Badges Earned"
          value={unlocked.length}
          sub={`of 8 total`}
        />
        <StatCard
          label="Best Streak"
          value={streaks.length
            ? Math.max(...streaks.map(s => s.best), 0)
            : 0
          }
          sub="Days in a row"
        />
      </div>

      {/* Weekly report card */}
      <div className="mb-8">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
          Weekly Report
        </h2>
        <WeeklyReportCard report={report} />
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
            7-Day Completion
          </h2>
          <WeeklyChart days={weekly?.days ?? []} />
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
            Habit Breakdown
          </h2>
          <HabitBreakdown habits={weekly?.habits ?? []} />
        </div>
      </div>

      {/* Streaks */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
          Streak Tracker
        </h2>
        <StreakList streaks={streaks} />
      </div>

      {/* Achievements */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
          Achievements
        </h2>
        <AchievementGrid unlocked={unlocked} />
      </div>

    </div>
  )
}