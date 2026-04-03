import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";

const PRESETS = [5, 10, 15, 25, 30, 45, 60];

export default function TimerWidget({
  habitId,
  habitName,
  onSaveLog,
  onFocusMode,
}) {
  const [mode, setMode] = useState("stopwatch"); // stopwatch | countdown
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [countdown, setCountdown] = useState(25 * 60); // seconds
  const [preset, setPreset] = useState(25);
  const [showPrompt, setShowPrompt] = useState(false);
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        if (mode === "stopwatch") {
          setElapsed((prev) => prev + 1);
        } else {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setRunning(false);
              setShowPrompt(true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const format = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleStart = () => setRunning(true);

  const handleStop = () => {
    setRunning(false);
    if (elapsed > 0 || (mode === "countdown" && countdown < preset * 60)) {
      setShowPrompt(true);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setCountdown(preset * 60);
    setShowPrompt(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const duration = mode === "stopwatch" ? elapsed : preset * 60 - countdown;
      await onSaveLog({
        date: new Date().toISOString().split("T")[0],
        duration,
        type: mode,
      });
      handleReset();
      setShowPrompt(false);
    } finally {
      setSaving(false);
    }
  };

  const handlePreset = (mins) => {
    setPreset(mins);
    setCountdown(mins * 60);
    setRunning(false);
    setElapsed(0);
  };

  const displayTime =
    mode === "stopwatch" ? format(elapsed) : format(countdown);

  const countdownPct =
    mode === "countdown"
      ? Math.round((1 - countdown / (preset * 60)) * 100)
      : 0;

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex bg-zinc-800 rounded-xl p-1 mb-5">
        {[
          { value: "stopwatch", label: "⏱ Stopwatch" },
          { value: "countdown", label: "⏳ Countdown" },
        ].map((m) => (
          <button
            key={m.value}
            onClick={() => {
              setMode(m.value);
              handleReset();
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              mode === m.value
                ? "bg-[var(--color-primary)] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Countdown preset */}
      {mode === "countdown" && !running && (
        <div className="flex gap-2 flex-wrap mb-4">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                preset === p
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {p}m
            </button>
          ))}
        </div>
      )}

      {/* Timer display */}
      <div className="text-center py-6">
        {/* Circular progress — countdown only */}
        {mode === "countdown" && (
          <div className="relative inline-block mb-4">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="#27272a"
                strokeWidth="8"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - countdownPct / 100)}`}
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dashoffset 0.5s" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-white font-mono">
                {displayTime}
              </span>
            </div>
          </div>
        )}

        {/* Stopwatch display */}
        {mode === "stopwatch" && (
          <div className="text-6xl font-black text-white font-mono mb-4">
            {displayTime}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!running ? (
            <Button onClick={handleStart}>
              {elapsed > 0 || countdown < preset * 60 ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button variant="danger" onClick={handleStop}>
              Stop
            </Button>
          )}
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          {running && (
            <Button variant="ghost" onClick={onFocusMode}>
              ⛶ Focus
            </Button>
          )}
        </div>
      </div>

      {/* Save prompt */}
      {showPrompt && (
        <div
          className="rounded-2xl p-4 border mt-4"
          style={{
            background: "rgba(var(--color-primary-rgb), 0.08)",
            borderColor: "rgba(var(--color-primary-rgb), 0.3)",
          }}
        >
          <p className="text-white font-semibold text-sm mb-1">
            Session complete!
          </p>
          <p className="text-zinc-400 text-xs mb-4">
            Duration:{" "}
            {format(mode === "stopwatch" ? elapsed : preset * 60 - countdown)} —
            Save this session?
          </p>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Session"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowPrompt(false);
                handleReset();
              }}
            >
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
