import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const fieldClassName =
    "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

  const resetEdit = () => {
    setEditId(null);
    setEditName("");
    setEditColor("");
    setSavingEdit(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;

    try {
      setIsCreating(true);
      await onCreate({
        name: newName.trim(),
        color: newColor,
      });
      setNewName("");
      setNewColor("#3b82f6");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editId) return;

    try {
      setSavingEdit(true);
      await onUpdate(editId, {
        name: editName.trim(),
        color: editColor,
      });
      resetEdit();
    } finally {
      setSavingEdit(false);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <div className="space-y-5">
        {/* Existing categories */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Existing Categories
            </p>
            <p className="text-xs text-zinc-500">{categories.length} total</p>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white px-4 py-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                No categories yet
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Create your first category below to organize ideas better.
              </p>
            </div>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {categories.map((cat, index) => {
                  const isEditing = editId === cat._id;

                  return (
                    <motion.div
                      key={cat._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: index * 0.03 }}
                      className="rounded-3xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <input
                            className={fieldClassName}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Category name"
                            autoFocus
                          />

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                              <input
                                type="color"
                                value={editColor}
                                onChange={(e) => setEditColor(e.target.value)}
                                className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                              />
                              <div>
                                <p className="text-xs uppercase tracking-widest text-zinc-500">
                                  Color
                                </p>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                  {editColor}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-1 gap-2 justify-end">
                              <Button
                                size="sm"
                                onClick={handleSaveEdit}
                                loading={savingEdit}
                                disabled={savingEdit || !editName.trim()}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetEdit}
                                disabled={savingEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full ring-4 ring-black/0"
                            style={{
                              background: cat.color,
                              boxShadow: `${cat.color}35 0 0 0 6px`,
                            }}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
                              {cat.name}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {cat.color}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={() => startEdit(cat)}
                              className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-white"
                            >
                              Edit
                            </motion.button>

                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDelete(cat._id)}
                              className="rounded-2xl border border-red-500/20 px-3 py-2 text-xs font-medium text-zinc-500 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Add new */}
        <div className="rounded-3xl border border-zinc-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
            New Category
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className={fieldClassName}
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Color
                </p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {newColor}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleCreate}
              className="w-full"
              loading={isCreating}
              disabled={!newName.trim() || isCreating}
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ManageCategoriesModal;
