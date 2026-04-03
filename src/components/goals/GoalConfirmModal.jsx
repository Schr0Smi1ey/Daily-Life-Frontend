import Modal from "../ui/Modal";
import Button from "../ui/Button";

const CONFIGS = {
  delete: {
    title: "Delete goal",
    eyebrow: "Danger zone",
    icon: "🗑️",
    tone: "red",
    message: (goal) => `You are about to permanently delete "${goal?.title}".`,
    warning:
      "All daily targets and progress logs will be removed forever. This action cannot be undone.",
    confirm: "Delete Permanently",
    variant: "danger",
  },
  pause: {
    title: "Pause goal",
    eyebrow: "Status change",
    icon: "⏸️",
    tone: "yellow",
    message: (goal) => `You are about to pause "${goal?.title}".`,
    warning:
      "The day counter will keep running while paused. Your progress stays safe, but daily targets will continue to accumulate.",
    confirm: "Pause Goal",
    variant: "ghost",
  },
  archive: {
    title: "Archive goal",
    eyebrow: "Move out of focus",
    icon: "📦",
    tone: "zinc",
    message: (goal) => `You are about to archive "${goal?.title}".`,
    warning:
      "Archived goals are hidden from the main list, but all data is preserved. You can restore them anytime from the Archived tab.",
    confirm: "Archive Goal",
    variant: "ghost",
  },
};

function WarningBox({ tone, children }) {
  const styles = {
    red: "border-red-500/20 bg-red-500/10 text-red-400",
    yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    zinc: "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles[tone]}`}>
      <p className="text-xs leading-5">⚠️ {children}</p>
    </div>
  );
}

export default function GoalConfirmModal({
  isOpen,
  onClose,
  goal,
  type,
  onConfirm,
}) {
  if (!goal || !type) return null;

  const config = CONFIGS[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4 text-5xl">{config.icon}</div>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
            {config.eyebrow}
          </p>

          <p className="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-100">
            {config.message(goal)}
          </p>
        </div>

        <WarningBox tone={config.tone}>{config.warning}</WarningBox>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant={config.variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1"
          >
            {config.confirm}
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className="sm:min-w-[110px]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
