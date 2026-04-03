import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Copy,
  Pencil,
} from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import AddTemplateModal from "../components/templates/AddTemplateModal";
import { CATEGORIES } from "../constants/habits";
import useTemplates from "../hooks/useTemplates";
import useHabits from "../hooks/useHabits";

const panelClassName =
  "rounded-3xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)]";

const fieldClassName =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

const selectClassName =
  "w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 pr-10 py-3 text-sm text-zinc-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white";

function SelectField({ value, onChange, children }) {
  return (
    <div className="relative min-w-[140px] flex-1">
      <select className={selectClassName} value={value} onChange={onChange}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}

export default function Templates() {
  const {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    addHabitToTemplate,
    removeHabitFromTemplate,
  } = useTemplates();

  const { createHabit } = useHabits();

  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingTpl, setEditingTpl] = useState(null);
  const [addingHabit, setAddingHabit] = useState(null);
  const [newHabitForm, setNewHabitForm] = useState({
    name: "",
    category: "general",
    frequency: "daily",
    routine: "none",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [addedMsg, setAddedMsg] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return templates;

    return templates.filter((tpl) => {
      const matchesName = tpl.name?.toLowerCase().includes(query);
      const matchesDescription = tpl.description?.toLowerCase().includes(query);

      const matchesHabits = tpl.habits?.some((habit) => {
        return (
          habit.name?.toLowerCase().includes(query) ||
          habit.category?.toLowerCase().includes(query) ||
          habit.frequency?.toLowerCase().includes(query) ||
          habit.routine?.toLowerCase().includes(query)
        );
      });

      return matchesName || matchesDescription || matchesHabits;
    });
  }, [templates, search]);

  const totalHabits = useMemo(
    () => templates.reduce((sum, tpl) => sum + (tpl.habits?.length || 0), 0),
    [templates],
  );

  const handleAddAllHabits = async (template) => {
    for (const h of template.habits) {
      await createHabit(h);
    }
    setAddedMsg(`All habits from "${template.name}" added.`);
    setTimeout(() => setAddedMsg(""), 3000);
  };

  const handleAddOneHabit = async (habit) => {
    await createHabit(habit);
    setAddedMsg(`"${habit.name}" added to your habits.`);
    setTimeout(() => setAddedMsg(""), 3000);
  };

  const handleSaveEdit = async () => {
    if (!editingTpl) return;
    await updateTemplate(editingTpl.id, {
      name: editingTpl.name,
      description: editingTpl.desc,
    });
    setEditingTpl(null);
  };

  const handleAddHabitToTpl = async (tplId) => {
    if (!newHabitForm.name.trim()) return;
    await addHabitToTemplate(tplId, newHabitForm);
    setNewHabitForm({
      name: "",
      category: "general",
      frequency: "daily",
      routine: "none",
    });
    setAddingHabit(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === "template") {
      await deleteTemplate(deleteConfirm.tplId);
      if (expandedId === deleteConfirm.tplId) setExpandedId(null);
    } else {
      await removeHabitFromTemplate(
        deleteConfirm.tplId,
        deleteConfirm.habitIndex,
      );
    }

    setDeleteConfirm(null);
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="space-y-6"
    >
      <PageHeader
        title="TEMPLATES"
        subtitle="Habit packs you can add with one click."
      >
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + New Template
        </Button>
      </PageHeader>

      <AnimatePresence>
        {addedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3"
          >
            <p className="text-sm font-medium text-green-400">✓ {addedMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className={`${panelClassName} p-4 md:p-5`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-primary-rgb),0.18)] bg-[rgba(var(--color-primary-rgb),0.08)] px-3 py-1 text-[11px] font-medium text-[var(--color-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              Template Library
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              Each template is a reusable pack of habits. Add the full set
              instantly, or open a template to add and manage habits one by one.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Templates
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {templates.length}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Total Habits
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {totalHabits}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Search
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                {search ? "Filtered" : "All visible"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              className={`${fieldClassName} pl-11`}
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </motion.section>

      <AnimatePresence mode="wait">
        <motion.section
          key={search}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {filtered.length === 0 ? (
            <div className={`${panelClassName} p-6`}>
              <EmptyState
                icon="📋"
                message={
                  search
                    ? `No templates matching "${search}"`
                    : "No templates yet."
                }
                actionLabel={!search ? "Create Template" : undefined}
                onAction={!search ? () => setShowAdd(true) : undefined}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((tpl, index) => {
                const isExpanded = expandedId === tpl._id;
                const isEditing = editingTpl?.id === tpl._id;

                return (
                  <motion.div
                    key={tpl._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                    className={`${panelClassName} overflow-hidden transition-all ${
                      isExpanded
                        ? "border-[rgba(var(--color-primary-rgb),0.24)] shadow-[0_0_0_1px_rgba(var(--color-primary-rgb),0.10),0_12px_36px_rgba(0,0,0,0.06)]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start">
                      <div
                        className="flex min-w-0 flex-1 cursor-pointer items-start gap-4"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : tpl._id)
                        }
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03]">
                          <Sparkles
                            className="h-5 w-5"
                            style={{ color: "var(--color-primary)" }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div
                              className="space-y-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                className={fieldClassName}
                                value={editingTpl.name}
                                onChange={(e) =>
                                  setEditingTpl((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />
                              <input
                                className={fieldClassName}
                                placeholder="Description"
                                value={editingTpl.desc}
                                onChange={(e) =>
                                  setEditingTpl((prev) => ({
                                    ...prev,
                                    desc: e.target.value,
                                  }))
                                }
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit}>
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingTpl(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex min-w-0 items-center gap-3">
                                <h3 className="truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                                  {tpl.name}
                                </h3>
                                <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-white/10 dark:bg-white/[0.03]">
                                  {tpl.habits?.length || 0} habits
                                </span>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="ml-auto text-zinc-500"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.div>
                              </div>

                              {tpl.description && (
                                <p className="mt-1 text-sm text-zinc-500">
                                  {tpl.description}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {!isEditing && (
                        <div className="flex flex-wrap gap-2 lg:shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleAddAllHabits(tpl)}
                          >
                            Add All
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => duplicateTemplate(tpl._id)}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingTpl({
                                id: tpl._id,
                                name: tpl.name,
                                desc: tpl.description || "",
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              setDeleteConfirm({
                                type: "template",
                                tplId: tpl._id,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-zinc-200/70 px-5 pb-5 pt-4 dark:border-white/10">
                            {tpl.habits?.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 px-4 py-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                  No habits in this template yet
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  Start by adding your first habit below.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                {tpl.habits?.map((h, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className="group flex items-center gap-3 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                                        {h.name}
                                      </p>

                                      <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <Badge category={h.category} />
                                        <span className="text-xs capitalize text-zinc-500">
                                          {h.frequency}
                                        </span>
                                        {h.routine !== "none" && (
                                          <span className="text-xs text-zinc-500">
                                            {h.routine === "morning"
                                              ? "☀️ Morning"
                                              : "🌙 Night"}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex gap-2 opacity-75 transition group-hover:opacity-100">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleAddOneHabit(h)}
                                      >
                                        + Add
                                      </Button>

                                      <button
                                        onClick={() =>
                                          setDeleteConfirm({
                                            type: "habit",
                                            tplId: tpl._id,
                                            habitIndex: idx,
                                          })
                                        }
                                        className="rounded-xl border border-red-500/15 px-3 py-2 text-xs font-medium text-zinc-500 transition hover:border-red-500/35 hover:bg-red-500/5 hover:text-red-400"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {addingHabit === tpl._id ? (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 rounded-3xl border border-zinc-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
                              >
                                <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                                  New Habit
                                </p>

                                <input
                                  className={`${fieldClassName} mb-3`}
                                  placeholder="Habit name"
                                  value={newHabitForm.name}
                                  onChange={(e) =>
                                    setNewHabitForm((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                />

                                <div className="mb-4 flex flex-col gap-3 md:flex-row">
                                  <SelectField
                                    value={newHabitForm.category}
                                    onChange={(e) =>
                                      setNewHabitForm((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                      }))
                                    }
                                  >
                                    {CATEGORIES.map((c) => (
                                      <option key={c} value={c}>
                                        {c}
                                      </option>
                                    ))}
                                  </SelectField>

                                  <SelectField
                                    value={newHabitForm.frequency}
                                    onChange={(e) =>
                                      setNewHabitForm((prev) => ({
                                        ...prev,
                                        frequency: e.target.value,
                                      }))
                                    }
                                  >
                                    <option value="daily">Daily</option>
                                    <option value="weekdays">Weekdays</option>
                                  </SelectField>

                                  <SelectField
                                    value={newHabitForm.routine}
                                    onChange={(e) =>
                                      setNewHabitForm((prev) => ({
                                        ...prev,
                                        routine: e.target.value,
                                      }))
                                    }
                                  >
                                    <option value="none">No Routine</option>
                                    <option value="morning">☀️ Morning</option>
                                    <option value="night">🌙 Night</option>
                                  </SelectField>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddHabitToTpl(tpl._id)}
                                  >
                                    Add Habit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setAddingHabit(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => setAddingHabit(tpl._id)}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-4 py-3 text-sm font-medium text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-white"
                              >
                                <Plus className="h-4 w-4" />
                                Add habit to this template
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <AddTemplateModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createTemplate}
      />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={
          deleteConfirm?.type === "template"
            ? "Delete Template"
            : "Remove Habit"
        }
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4 rounded-3xl border border-red-500/15 bg-red-500/6 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
              <Trash2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {deleteConfirm?.type === "template"
                  ? "Delete this entire template pack?"
                  : "Remove this habit from the template?"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {deleteConfirm?.type === "template"
                  ? "Habits already added from this template will not be affected."
                  : "This only removes the habit from the template, not from your active habits."}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDeleteConfirmed}
              className="flex-1"
            >
              Confirm
            </Button>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
