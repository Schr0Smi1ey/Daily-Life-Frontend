import { useMemo, useState } from "react";
import DailyGreeting from "../components/dashboard/DailyGreeting";
import DailyQuote from "../components/dashboard/DailyQuote";
import ConsistencyScore from "../components/dashboard/ConsistencyScore";
import HabitSnapshot from "../components/dashboard/HabitSnapshot";
import ActiveGoalsSummary from "../components/dashboard/ActiveGoalsSummary";
import QuickAdd from "../components/dashboard/QuickAdd";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import BadgeToast from "../components/ui/BadgeToast";
import AddEntryModal from "../components/journal/AddEntryModal";
import PageHeader from "../components/layout/PageHeader";
import useHabits from "../hooks/useHabits";
import useGoals from "../hooks/useGoals";
import useProgress from "../hooks/useProgress";
import useJournal from "../hooks/useJournal";
import useAchievements from "../hooks/useAchievements";
import useAchievementChecker from "../hooks/useAchievementChecker";

function SectionShell({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

function DashboardStats({ habits, goals, entries, today, bestStreak }) {
  const completedToday = habits.filter((h) =>
    h.checkins?.some((c) => c.date === today),
  ).length;

  const activeGoals = goals.filter((g) => g.status === "active").length;

  const stats = [
    {
      label: "Today",
      value: `${completedToday}/${habits.length}`,
      sub: "Habits done",
      accent: true,
    },
    {
      label: "Best Streak",
      value: bestStreak > 0 ? `${bestStreak}🔥` : "—",
      sub: "Days in a row",
    },
    {
      label: "Active Goals",
      value: activeGoals,
      sub: "In progress",
    },
    {
      label: "Journal",
      value: entries.length,
      sub: "Total entries",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
          accent={stat.accent}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { habits, loading: habitsLoading } = useHabits();
  const { goals, loading: goalsLoading } = useGoals();
  const { weekly, loading: progressLoading } = useProgress();
  const { entries, createEntry, loading: journalLoading } = useJournal();
  const { unlocked, unlock, newBadgeKey, clearNewBadge } = useAchievements();

  const [showJournal, setShowJournal] = useState(false);

  useAchievementChecker({ habits, goals, entries, unlocked, unlock });

  const isLoading =
    habitsLoading || goalsLoading || progressLoading || journalLoading;

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const bestStreak = useMemo(() => {
    return habits.reduce((max, habit) => {
      let streak = 0;
      const d = new Date();

      while (true) {
        const key = d.toISOString().split("T")[0];

        if (habit.checkins?.some((c) => c.date === key)) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else if (streak === 0) {
          d.setDate(d.getDate() - 1);
          const prev = d.toISOString().split("T")[0];
          if (!habit.checkins?.some((c) => c.date === prev)) break;
        } else {
          break;
        }
      }

      return Math.max(max, streak);
    }, 0);
  }, [habits]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-6">
          <PageHeader
            title="Dashboard"
            subtitle="Your personal command center for habits, goals, consistency, and daily reflection."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <SectionShell>
              <DailyGreeting />
            </SectionShell>

            <SectionShell>
              <DailyQuote />
            </SectionShell>
          </div>
        </div>

        <SectionShell
          title="Quick actions"
          subtitle="Capture momentum fast and keep your day moving."
        >
          <QuickAdd onNewJournal={() => setShowJournal(true)} />
        </SectionShell>

        <DashboardStats
          habits={habits}
          goals={goals}
          entries={entries}
          today={today}
          bestStreak={bestStreak}
        />

        <SectionShell
          title="Weekly consistency"
          subtitle="A snapshot of how steadily you're showing up this week."
        >
          <ConsistencyScore score={weekly?.overallScore ?? 0} />
        </SectionShell>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionShell
            title="Habit snapshot"
            subtitle="See where your routines stand today."
          >
            <HabitSnapshot habits={habits} />
          </SectionShell>

          <SectionShell
            title="Active goals"
            subtitle="Track the goals currently in motion."
          >
            <ActiveGoalsSummary goals={goals} />
          </SectionShell>
        </div>
      </div>

      <AddEntryModal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        onCreate={createEntry}
        existingDates={entries.map((e) => e.date)}
      />

      <BadgeToast newBadgeKey={newBadgeKey} onDone={clearNewBadge} />
    </>
  );
}
