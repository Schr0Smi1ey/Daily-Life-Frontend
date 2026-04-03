import { motion } from "framer-motion";
import { Activity, Award, Flame, LineChart } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import WeeklyChart from "../components/progress/WeeklyChart";
import HabitBreakdown from "../components/progress/HabitBreakdown";
import StreakList from "../components/progress/StreakList";
import WeeklyReportCard from "../components/progress/WeeklyReportCard";
import AchievementGrid from "../components/progress/AchievementGrid";
import useProgress from "../hooks/useProgress";
import useAchievements from "../hooks/useAchievements";

const panelClassName =
  "rounded-3xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)]";

function SectionCard({ title, icon: Icon, children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className={`${panelClassName} p-5 md:p-6 ${className}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200/70 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03]">
          <Icon className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
        </div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

export default function Progress() {
  const { weekly, streaks, report, loading } = useProgress();
  const { unlocked } = useAchievements();

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  const bestStreak = streaks.length
    ? Math.max(...streaks.map((s) => s.best), 0)
    : 0;

  const overallScore = weekly?.overallScore ?? 0;
  const trackedHabits = weekly?.habits?.length ?? 0;
  const totalAchievements = unlocked.length;
  const activeDays = weekly?.days?.filter((d) => d.completed > 0).length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <PageHeader title="PROGRESS" subtitle="Your numbers. Your story." />

      {/* Hero summary */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.24 }}
        className={`${panelClassName} overflow-hidden p-5 md:p-6`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-primary-rgb),0.18)] bg-[rgba(var(--color-primary-rgb),0.08)] px-3 py-1 text-[11px] font-medium text-[var(--color-primary)]">
              <LineChart className="h-3.5 w-3.5" />
              Weekly Momentum
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-2xl">
              You’re at{" "}
              <span style={{ color: "var(--color-primary)" }}>
                {overallScore}%
              </span>{" "}
              this week.
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Track your consistency, review streaks, and spot the habits that
              are moving your momentum forward.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[440px]">
            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Score
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {overallScore}%
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Habits
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {trackedHabits}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Best Streak
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {bestStreak}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Active Days
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {activeDays}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.24 }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatCard
          label="Overall Score"
          value={`${overallScore}%`}
          sub="This week"
          accent
        />
        <StatCard
          label="Habits Tracked"
          value={trackedHabits}
          sub="Active habits"
        />
        <StatCard
          label="Badges Earned"
          value={totalAchievements}
          sub="Unlocked"
        />
        <StatCard label="Best Streak" value={bestStreak} sub="Days in a row" />
      </motion.div>

      {/* Weekly report */}
      <SectionCard title="Weekly Report" icon={Activity}>
        <WeeklyReportCard report={report} />
      </SectionCard>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="7-Day Completion" icon={LineChart}>
          <WeeklyChart days={weekly?.days ?? []} />
        </SectionCard>

        <SectionCard title="Habit Breakdown" icon={Activity}>
          <HabitBreakdown habits={weekly?.habits ?? []} />
        </SectionCard>
      </div>

      {/* Streaks + Achievements */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Streak Tracker" icon={Flame}>
          <StreakList streaks={streaks} />
        </SectionCard>

        <SectionCard title="Achievements" icon={Award}>
          <AchievementGrid unlocked={unlocked} />
        </SectionCard>
      </div>
    </motion.div>
  );
}
