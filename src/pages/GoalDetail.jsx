import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ProgressBar from "../components/ui/ProgressBar";
import GoalConfirmModal from "../components/goals/GoalConfirmModal";
import DailyTargetGrid from "../components/goals/DailyTargetGrid";
import useGoals from "../hooks/useGoals";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SectionCard({ eyebrow, title, subtitle, children, actions }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] md:p-6">
      {(eyebrow || title || subtitle || actions) && (
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
                {eyebrow}
              </p>
            ) : null}

            {title ? (
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
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

function HeaderPill({ children, tone = "default" }) {
  const tones = {
    default:
      "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300",
    primary:
      "border-transparent text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.12)]",
    success: "border-transparent bg-green-500/10 text-green-400",
    warning: "border-transparent bg-yellow-500/10 text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function IconButton({ children, onClick, variant = "ghost", label }) {
  const variants = {
    ghost:
      "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white",
    danger:
      "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20",
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function DuplicateIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <path d="M5 15V7a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M6 7h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" />
      <path d="M9 4h6l1 3H8l1-3Z" />
      <path d="M10 12h4" />
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
    >
      <path d="M3 6h18" />
      <path d="M8 6V4.75C8 4.34 8.34 4 8.75 4h6.5c.41 0 .75.34.75.75V6" />
      <path d="M19 6l-1 13.25c-.03.42-.38.75-.8.75H6.8c-.42 0-.77-.33-.8-.75L5 6" />
      <path d="M10 10.25v6.5" />
      <path d="M14 10.25v6.5" />
    </svg>
  );
}

function DetailStat({ label, value, tone = "default" }) {
  const toneClass =
    tone === "primary"
      ? "text-[var(--color-primary)]"
      : tone === "success"
        ? "text-green-400"
        : tone === "warning"
          ? "text-yellow-400"
          : "text-zinc-950 dark:text-white";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getDetail,
    logDay,
    unlogDay,
    overrideDay,
    updateGoal,
    archiveGoal,
    deleteGoal,
    duplicateGoal,
  } = useGoals();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmType, setConfirmType] = useState(null);
  const [logging, setLogging] = useState(false);
  const [actualInput, setActualInput] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [celebration, setCelebration] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function fetchDetail() {
    try {
      setLoading(true);
      const data = await getDetail(id);
      setDetail(data);
      if (data.celebration) setCelebration(data.celebration);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleLogDay = async () => {
    try {
      setLogging(true);
      if (detail.goal.goalType === "numerical") {
        await logDay(id, Number(actualInput));
        setActualInput("");
        setShowLog(false);
      } else {
        await logDay(id, 1);
      }
      await fetchDetail();
    } finally {
      setLogging(false);
    }
  };

  const handleUnlogDay = async () => {
    await unlogDay(id);
    await fetchDetail();
  };

  const handleOverride = async (day, newTarget) => {
    await overrideDay(id, day, newTarget);
    await fetchDetail();
  };

  const handleDelete = async () => {
    await deleteGoal(id);
    navigate("/goals");
  };

  const handleArchive = async () => {
    await archiveGoal(id);
    navigate("/goals");
  };

  const handleDuplicate = async () => {
    await duplicateGoal(id);
    navigate("/goals");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="py-16 text-center text-zinc-500 dark:text-zinc-400">
        Goal not found.
      </div>
    );
  }

  const { goal, dayNum, daysLeft, stats } = detail;

  const chartData =
    goal.goalType === "numerical"
      ? goal.dailyTargets
          ?.filter((d) => d.date <= today)
          .map((d) => ({
            label: `Day ${d.day}`,
            target: d.target,
            actual: d.actual || 0,
          }))
      : goal.completedDays
          ?.slice()
          .sort()
          .map((date, i) => ({
            label: `Day ${i + 1}`,
            actual: 1,
            target: 1,
          }));

  const todayTarget =
    goal.goalType === "numerical"
      ? goal.dailyTargets?.find((d) => d.date === today)
      : null;

  const doneToday =
    goal.goalType === "numerical"
      ? todayTarget?.locked
      : goal.completedDays?.includes(today);

  const statusTone =
    goal.status === "completed"
      ? "success"
      : goal.status === "paused"
        ? "warning"
        : "primary";

  const todayProgress =
    goal.goalType === "numerical" && todayTarget?.target
      ? Math.round((todayTarget.actual / todayTarget.target) * 100)
      : 0;

  return (
    <>
      <div className="max-w-5xl space-y-6 md:space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/goals")}>
            ← Goals
          </Button>
        </div>

        <AnimatePresence>
          {celebration ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-3xl border px-5 py-4 text-center text-sm font-semibold"
              style={{
                background: "rgba(var(--color-primary-rgb), 0.12)",
                color: "var(--color-primary)",
                borderColor: "rgba(var(--color-primary-rgb), 0.25)",
              }}
            >
              {celebration}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <SectionCard
          eyebrow="Goal overview"
          title={goal.title}
          subtitle={
            goal.description ||
            "Track progress, manage status, and stay aligned day by day."
          }
          actions={
            <div className="flex items-center gap-2">
              <IconButton label="Duplicate goal" onClick={handleDuplicate}>
                <DuplicateIcon />
              </IconButton>
              <IconButton
                label="Archive goal"
                onClick={() => setConfirmType("archive")}
              >
                <ArchiveIcon />
              </IconButton>
              <IconButton
                label="Delete goal"
                variant="danger"
                onClick={() => setConfirmType("delete")}
              >
                <TrashIcon />
              </IconButton>
            </div>
          }
        >
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <HeaderPill tone="primary">
              Day {dayNum} of {goal.targetDays}
            </HeaderPill>

            <HeaderPill tone={statusTone}>{goal.status}</HeaderPill>

            <HeaderPill>
              {goal.goalType === "numerical" ? "Numerical" : "Daily habit"}
            </HeaderPill>

            {goal.goalType === "numerical" ? (
              <HeaderPill>
                {goal.totalTarget} {goal.unit}
              </HeaderPill>
            ) : null}

            {daysLeft > 0 ? (
              <HeaderPill>{daysLeft} days left</HeaderPill>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <DetailStat
              label="Progress"
              value={`${stats.overallPct}%`}
              tone="primary"
            />
            <DetailStat
              label="Status"
              value={stats.onTrack ? "On track" : "Behind"}
              tone={stats.onTrack ? "success" : "warning"}
            />
            <DetailStat
              label="Today"
              value={doneToday ? "Done" : "Pending"}
              tone={doneToday ? "success" : "default"}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {goal.goalType === "numerical"
                  ? `${stats.totalLogged || 0} / ${stats.totalTarget} ${goal.unit}`
                  : `${stats.completedCount || 0} / ${goal.targetDays} days`}
              </span>

              <span
                className="text-xs font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {stats.overallPct}%
              </span>
            </div>

            <ProgressBar
              value={stats.overallPct}
              color={goal.status === "completed" ? "green" : "primary"}
              height="h-2.5"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-200 pt-5 dark:border-white/10">
            {["active", "paused", "completed"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  if (status === "paused" && goal.status !== "paused") {
                    setConfirmType("pause");
                  } else {
                    updateGoal(id, { status }).then(fetchDetail);
                  }
                }}
                className={`rounded-2xl px-4 py-2 text-xs font-semibold capitalize transition ${
                  goal.status === status
                    ? "text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
                }`}
                style={
                  goal.status === status
                    ? { backgroundColor: "var(--color-primary)" }
                    : {}
                }
              >
                {status}
              </button>
            ))}
          </div>
        </SectionCard>

        {goal.status === "active" ? (
          <SectionCard
            eyebrow="Today"
            title="Today's action"
            subtitle="Complete or log today's target directly from here."
          >
            {goal.goalType === "numerical" && todayTarget ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Today's target:{" "}
                      <span style={{ color: "var(--color-primary)" }}>
                        {todayTarget.target} {goal.unit}
                      </span>
                    </p>

                    {doneToday ? (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        Logged {todayTarget.actual} {goal.unit}
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
                        Pending
                      </span>
                    )}
                  </div>

                  {doneToday ? (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Daily progress
                        </span>
                        <span className="text-xs font-semibold text-green-400">
                          {todayTarget.actual} / {todayTarget.target}{" "}
                          {goal.unit}
                        </span>
                      </div>

                      <ProgressBar
                        value={todayProgress}
                        color="green"
                        height="h-2.5"
                      />
                    </div>
                  ) : null}
                </div>

                {!doneToday ? (
                  showLog ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="number"
                        className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-[var(--color-primary)] dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                        placeholder={`How many ${goal.unit} today?`}
                        value={actualInput}
                        onChange={(e) => setActualInput(e.target.value)}
                      />
                      <Button
                        onClick={handleLogDay}
                        disabled={logging || !actualInput}
                      >
                        {logging ? "Logging..." : "Log Progress"}
                      </Button>
                      <Button variant="ghost" onClick={() => setShowLog(false)}>
                        Cancel
                      </Button>
                    </motion.div>
                  ) : (
                    <Button onClick={() => setShowLog(true)}>
                      Log Today's Progress
                    </Button>
                  )
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-green-400">
                      ✓ Logged {todayTarget.actual} {goal.unit}
                    </span>
                    <button
                      type="button"
                      onClick={handleUnlogDay}
                      className="text-xs text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {!doneToday ? (
                  <Button onClick={handleLogDay} disabled={logging}>
                    {logging ? "Updating..." : "✓ Mark Today Done"}
                  </Button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-green-400">
                      ✓ Done today
                    </span>
                    <button
                      type="button"
                      onClick={handleUnlogDay}
                      className="text-xs text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        ) : null}

        {chartData?.length > 0 ? (
          <SectionCard
            eyebrow="Analytics"
            title="Progress trend"
            subtitle="A day-by-day view of how your goal has been moving."
          >
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorActual"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(113,113,122,0.22)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "rgba(24,24,27,0.98)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      fontSize: "12px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#colorActual)"
                    name={goal.unit || "done"}
                  />

                  {goal.goalType === "numerical" ? (
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#71717a"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                      fill="none"
                      name="target"
                    />
                  ) : null}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        ) : null}

        {goal.goalType === "numerical" ? (
          <SectionCard
            eyebrow="Planning"
            title="Daily targets"
            subtitle="Click any future day to override its target. Past days are locked."
          >
            <DailyTargetGrid
              dailyTargets={goal.dailyTargets || []}
              unit={goal.unit}
              today={today}
              onOverride={handleOverride}
            />
          </SectionCard>
        ) : (
          <SectionCard
            eyebrow="History"
            title="Completion calendar"
            subtitle="A visual map of every day completed so far."
          >
            <GoalHeatmap
              startDate={goal.startDate}
              targetDays={goal.targetDays}
              completedDays={goal.completedDays || []}
            />
          </SectionCard>
        )}
      </div>

      <GoalConfirmModal
        isOpen={!!confirmType}
        onClose={() => setConfirmType(null)}
        goal={goal}
        type={confirmType}
        onConfirm={() => {
          if (confirmType === "delete") handleDelete();
          if (confirmType === "archive") handleArchive();
          if (confirmType === "pause") {
            updateGoal(id, { status: "paused" }).then(fetchDetail);
          }
        }}
      />
    </>
  );
}

function GoalHeatmap({ startDate, targetDays, completedDays }) {
  const cells = Array.from({ length: targetDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const date = d.toISOString().split("T")[0];
    return { date, done: completedDays.includes(date), day: i + 1 };
  });

  return (
    <div className="flex flex-wrap gap-2">
      {cells.map((cell) => (
        <motion.div
          key={cell.day}
          whileHover={{ y: -2 }}
          title={`Day ${cell.day} — ${cell.date}${cell.done ? " ✓" : ""}`}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition ${
            cell.done
              ? "text-black shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
              : "border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400"
          }`}
          style={
            cell.done
              ? {
                  backgroundColor: "var(--color-primary)",
                }
              : {}
          }
        >
          {cell.day}
        </motion.div>
      ))}
    </div>
  );
}
