import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";

export default function HabitTemplatesModal({
  isOpen,
  onClose,
  fetchTemplates,
  onAddSingle,
  onAddBulk,
  categories = [],
}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchTemplates().then((data) => {
      setTemplates(data);
      setLoading(false);
    });
  }, [isOpen]);

  const handleAddSingle = async (habit) => {
    setAdding(habit.name);
    await onAddSingle(habit);
    setAdding(null);
  };

  const handleAddBulk = async (habits) => {
    setAdding("bulk");
    await onAddBulk(habits);
    setAdding(null);
    onClose();
  };

  const activePack = templates[activeTab];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="HABIT TEMPLATES">
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : templates.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-6">
          No templates found. Create one on the Templates page.
        </p>
      ) : (
        <div>
          {/* Template name tabs */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {templates.map((pack, i) => (
              <button
                key={pack._id}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === i
                    ? "bg-[var(--color-primary)] text-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                {pack.name}
              </button>
            ))}
          </div>

          {/* Active pack */}
          {activePack && (
            <div>
              {activePack.description && (
                <p className="text-zinc-500 text-xs mb-3">
                  {activePack.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <p className="text-zinc-600 text-xs">
                  {activePack.habits?.length || 0} habits
                </p>
                <Button
                  size="sm"
                  onClick={() => handleAddBulk(activePack.habits || [])}
                  disabled={adding === "bulk" || !activePack.habits?.length}
                >
                  {adding === "bulk" ? "Adding..." : "Add All"}
                </Button>
              </div>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {activePack.habits?.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {h.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge category={h.category} />
                        <span className="text-zinc-600 text-xs capitalize">
                          {h.frequency}
                        </span>
                        {h.routine !== "none" && (
                          <span className="text-zinc-600 text-xs">
                            {h.routine === "morning" ? "☀️" : "🌙"}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddSingle(h)}
                      disabled={adding === h.name}
                    >
                      {adding === h.name ? "..." : "+ Add"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
