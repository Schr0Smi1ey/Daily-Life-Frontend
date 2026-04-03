import Modal from "../ui/Modal";
import Button from "../ui/Button";

const CONFIGS = {
  delete: {
    title: "DELETE HABIT",
    icon: "🗑️",
    message: (h) => `Delete "${h?.name}"?`,
    warning: "All check-in history and time logs will be permanently lost.",
    confirm: "Delete Permanently",
    variant: "danger",
    color: "red",
  },
  archive: {
    title: "ARCHIVE HABIT",
    icon: "📦",
    message: (h) => `Archive "${h?.name}"?`,
    warning:
      "Habit will be hidden from your list. All history is preserved and you can restore it anytime.",
    confirm: "Archive Habit",
    variant: "ghost",
    color: "zinc",
  },
};

export default function HabitConfirmModal({
  isOpen,
  onClose,
  habit,
  type,
  onConfirm,
}) {
  if (!habit || !type) return null;
  const cfg = CONFIGS[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={cfg.title}>
      <div className="text-center mb-5">
        <div className="text-5xl mb-3">{cfg.icon}</div>
        <p className="text-white font-semibold text-sm">{cfg.message(habit)}</p>
      </div>

      <div
        className={`rounded-xl px-4 py-3 mb-6 ${
          cfg.color === "red"
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-zinc-800 border border-white/10"
        }`}
      >
        <p
          className={`text-xs ${
            cfg.color === "red" ? "text-red-400" : "text-zinc-400"
          }`}
        >
          ⚠️ {cfg.warning}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant={cfg.variant === "danger" ? "danger" : "ghost"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1"
        >
          {cfg.confirm}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
