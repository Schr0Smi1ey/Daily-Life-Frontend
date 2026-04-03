import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import HabitHeatmap from "../components/detail/HabitHeatmap";
import TimerWidget from "../components/detail/TimerWidget";
import FocusMode from "../components/detail/FocusMode";
import TimeLogHistory from "../components/detail/TimeLogHistory";
import HabitConfirmModal from "../components/habits/HabitConfirmModal";
import EditHabitModal from "../components/habits/EditHabitModal";
import useHabits from "../hooks/useHabits";
import useCategories from "../hooks/useCategories";

export default function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getDetail,
    checkin,
    undoCheckin,
    updateHabit,
    deleteHabit,
    archiveHabit,
    duplicateHabit,
    getTimeLogs,
    saveTimeLog,
    deleteTimeLog,
  } = useHabits();

  const { categories } = useCategories();

  const [detail, setDetail] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch");
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerPreset, setTimerPreset] = useState(25);
  const [confirmType, setConfirmType] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  async function fetchAll() {
    try {
      setLoading(true);
      const [d, logs] = await Promise.all([getDetail(id), getTimeLogs(id)]);
      setDetail(d);
      setTimeLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [id]);

  const handleCheckin = async () => {
    await checkin(id, { date: today });
    await fetchAll();
  };

  const handleUndoCheckin = async () => {
    await undoCheckin(id, today);
    await fetchAll();
  };

  const handleSaveLog = async (data) => {
    await saveTimeLog(id, data);
    const logs = await getTimeLogs(id);
    setTimeLogs(logs);
  };

  const handleDeleteLog = async (logId) => {
    await deleteTimeLog(id, logId);
    const logs = await getTimeLogs(id);
    setTimeLogs(logs);
  };

  const handleDelete = async () => {
    await deleteHabit(id);
    navigate("/habits");
  };

  const handleArchive = async () => {
    await archiveHabit(id);
    navigate("/habits");
  };

  const handleDuplicate = async () => {
    await duplicateHabit(id);
    navigate("/habits");
  };

  const handleUpdate = async (data) => {
    await updateHabit(id, data);
    await fetchAll();
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  if (!detail)
    return (
      <div className="text-center py-16 text-zinc-500">Habit not found.</div>
    );

  const { habit, streak, best, completionRate, trend } = detail;
  const isDoneToday = habit.checkins?.some((c) => c.date === today);

  const customCat = categories.find(
    (c) => c.name.toLowerCase() === habit.category?.toLowerCase(),
  );

  // Chart data
  const chartData = trend?.map((t) => ({
    label: new Date(t.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    done: t.done,
  }));

  return (
    <>
      <div className="max-w-3xl">
        {/* Back */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/habits")}>
            ← Habits
          </Button>
        </div>

        {/* Overview card */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white mb-2">
                {habit.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  category={habit.category}
                  customColor={customCat?.color}
                />
                <span className="text-zinc-600 text-xs capitalize">
                  {habit.frequency}
                </span>
                {habit.routine !== "none" && (
                  <span className="text-zinc-600 text-xs capitalize">
                    {habit.routine === "morning" ? "☀️ Morning" : "🌙 Night"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEdit(true)}
              >
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDuplicate}>
                ⧉
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmType("archive")}
              >
                📦
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setConfirmType("delete")}
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Current Streak",
                value: streak > 0 ? `${streak}🔥` : "—",
              },
              {
                label: "Longest Streak",
                value: best > 0 ? `${best} days` : "—",
              },
              { label: "30-Day Rate", value: `${completionRate}%` },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-zinc-800 rounded-xl p-3 text-center"
              >
                <p className="text-zinc-500 text-xs mb-1">{s.label}</p>
                <p className="text-white font-black text-lg">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Mark done */}
          {!isDoneToday ? (
            <Button onClick={handleCheckin} className="w-full">
              ✓ Mark Today Done
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              <span className="text-green-400 font-semibold text-sm">
                ✓ Completed today
              </span>
              <button
                onClick={handleUndoCheckin}
                className="text-zinc-600 hover:text-zinc-400 text-xs transition"
              >
                Undo
              </button>
            </div>
          )}
        </div>

        {/* Completion rate bar */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
              30-Day Completion
            </h2>
            <span
              className="text-sm font-black"
              style={{ color: "var(--color-primary)" }}
            >
              {completionRate}%
            </span>
          </div>
          <ProgressBar value={completionRate} height="h-3" />
        </div>

        {/* Trend chart */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
            30-Day Trend
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="habGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.4}
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
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10 }}
                interval={6}
              />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(v) => [v === 1 ? "Done ✓" : "Missed", ""]}
              />
              <Area
                type="monotone"
                dataKey="done"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#habGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
            12-Week Calendar
          </h2>
          <HabitHeatmap checkins={habit.checkins || []} weeks={12} />
        </div>

        {/* Timer */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
            Timer
          </h2>
          <TimerWidget
            habitId={id}
            habitName={habit.name}
            onSaveLog={handleSaveLog}
            onFocusMode={() => setFocusMode(true)}
          />
        </div>

        {/* Time logs */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-4">
            Session History
          </h2>
          <TimeLogHistory logs={timeLogs} onDelete={handleDeleteLog} />
        </div>
      </div>

      {/* Focus mode */}
      <FocusMode
        isOpen={focusMode}
        onClose={() => setFocusMode(false)}
        onSaveLog={handleSaveLog}
        mode={timerMode}
        preset={timerPreset}
      />

      {/* Confirm modals */}
      <HabitConfirmModal
        isOpen={!!confirmType}
        onClose={() => setConfirmType(null)}
        habit={habit}
        type={confirmType}
        onConfirm={() => {
          if (confirmType === "delete") handleDelete();
          if (confirmType === "archive") handleArchive();
        }}
      />

      {/* Edit modal */}
      <EditHabitModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        habit={habit}
        onUpdate={handleUpdate}
      />
    </>
  );
}
