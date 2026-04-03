import { useState, useEffect, useRef } from "react";

export default function FocusMode({
  isOpen,
  onClose,
  onSaveLog,
  mode = "stopwatch",
  initialElapsed = 0,
  preset = 25,
}) {
  const [elapsed, setElapsed] = useState(initialElapsed);
  const [countdown, setCountdown] = useState(preset * 60 - initialElapsed);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      document.exitFullscreen?.().catch(() => {});
    };
  }, [isOpen]);

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
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const displayTime =
    mode === "stopwatch" ? format(elapsed) : format(countdown);

  const pct =
    mode === "countdown"
      ? Math.round((1 - countdown / (preset * 60)) * 100)
      : 0;

  const handleExit = async () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    const duration = mode === "stopwatch" ? elapsed : preset * 60 - countdown;
    if (duration > 0) {
      await onSaveLog({
        date: new Date().toISOString().split("T")[0],
        duration,
        type: mode,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#050505" }}
    >
      {/* Exit hint */}
      <p className="text-zinc-700 text-xs mb-12 tracking-widest uppercase">
        Focus Mode — Press Exit to return
      </p>

      {/* Timer */}
      {mode === "countdown" ? (
        <div className="relative mb-8">
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="104"
              fill="none"
              stroke="#111"
              strokeWidth="8"
            />
            <circle
              cx="120"
              cy="120"
              r="104"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 104}`}
              strokeDashoffset={`${2 * Math.PI * 104 * (1 - pct / 100)}`}
              transform="rotate(-90 120 120)"
              style={{ transition: "stroke-dashoffset 0.5s" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-black text-white font-mono">
              {displayTime}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-8xl font-black text-white font-mono mb-8">
          {displayTime}
        </div>
      )}

      {/* Status */}
      <p className="text-zinc-500 text-sm mb-8">
        {running ? "● Recording session..." : "● Paused"}
      </p>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-8 py-3 rounded-2xl font-bold text-black text-sm transition hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button
          onClick={handleExit}
          className="px-8 py-3 rounded-2xl font-bold text-sm border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition"
        >
          Exit & Save
        </button>
      </div>
    </div>
  );
}
