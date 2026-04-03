import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import useIdeas from "../hooks/useIdeas";
import useIdeaCategories from "../hooks/useIdeaCategories";
import IdeaCard from "../components/ideas/IdeaCard";
import IdeaModal from "../components/ideas/IdeaModal";
import ManageCategoriesModal from "../components/ideas/ManageCategoriesModal";

const panelClassName =
  "rounded-3xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)]";

const fieldClassName =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(var(--color-primary-rgb),0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-500";

export default function Ideas() {
  const {
    ideas,
    archivedIdeas,
    loading,
    createIdea,
    updateIdea,
    deleteIdea,
    archiveIdea,
    unarchiveIdea,
    toggleFavorite,
    togglePin,
  } = useIdeas();

  const { categories, createCategory, updateCategory, deleteCategory } =
    useIdeaCategories();

  const [showAdd, setShowAdd] = useState(false);
  const [editIdea, setEditIdea] = useState(null);
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  const handleCreate = async (data) => {
    await createIdea(data);
  };

  const handleUpdate = async (data) => {
    await updateIdea(editIdea._id, data);
    setEditIdea(null);
  };

  const displayIdeas = useMemo(() => {
    let list = showArchive ? archivedIdeas : ideas;

    if (catFilter !== "all") {
      list = list.filter(
        (i) => i.category?.toLowerCase() === catFilter.toLowerCase(),
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.details?.some((d) => d.toLowerCase().includes(query)),
      );
    }

    if (sortBy === "favorites") {
      list = list.filter((i) => i.favorite);
    }

    // Keep pinned ideas visually prioritized
    list = [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }, [ideas, archivedIdeas, catFilter, search, sortBy, showArchive]);

  const activeIdeasCount = ideas.length;
  const archivedIdeasCount = archivedIdeas.length;
  const favoriteCount = ideas.filter((i) => i.favorite).length;
  const pinnedCount = ideas.filter((i) => i.pinned).length;

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <PageHeader
        title="IDEAS"
        subtitle="Capture thoughts before they disappear."
      >
        <Button variant="ghost" size="sm" onClick={() => setShowCatMgr(true)}>
          🏷 Categories
        </Button>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + New Idea
        </Button>
      </PageHeader>

      {/* Unified controls panel */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.24 }}
        className={`${panelClassName} p-4 md:p-5`}
      >
        <div className="flex flex-col gap-4">
          {/* Top controls */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowArchive(false)}
                className={`rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  !showArchive
                    ? "text-black shadow-[0_10px_24px_rgba(var(--color-primary-rgb),0.24)]"
                    : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:text-white"
                }`}
                style={
                  !showArchive
                    ? { backgroundColor: "var(--color-primary)" }
                    : undefined
                }
              >
                Active ({activeIdeasCount})
              </button>

              <button
                onClick={() => setShowArchive(true)}
                className={`rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  showArchive
                    ? "text-black shadow-[0_10px_24px_rgba(var(--color-primary-rgb),0.24)]"
                    : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:text-white"
                }`}
                style={
                  showArchive
                    ? { backgroundColor: "var(--color-primary)" }
                    : undefined
                }
              >
                Archived ({archivedIdeasCount})
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                className={fieldClassName}
                placeholder="Search ideas, concepts, bullets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="relative">
                <select
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none appearance-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest" className="bg-zinc-900 text-white">
                    Newest
                  </option>
                  <option value="oldest" className="bg-zinc-900 text-white">
                    Oldest
                  </option>
                  <option value="favorites" className="bg-zinc-900 text-white">
                    Favorites only
                  </option>
                </select>
                {/* Custom arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCatFilter("all")}
              className={`rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all ${
                catFilter === "all"
                  ? "text-black shadow-[0_8px_20px_rgba(var(--color-primary-rgb),0.22)]"
                  : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:text-white"
              }`}
              style={
                catFilter === "all"
                  ? { backgroundColor: "var(--color-primary)" }
                  : undefined
              }
            >
              All ({activeIdeasCount})
            </button>

            {categories.map((cat) => {
              const count = ideas.filter(
                (i) => i.category?.toLowerCase() === cat.name.toLowerCase(),
              ).length;

              if (count === 0) return null;

              const isActive = catFilter === cat.name;

              return (
                <button
                  key={cat._id}
                  onClick={() => setCatFilter(cat.name)}
                  className="rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all"
                  style={
                    isActive
                      ? {
                          background: cat.color,
                          color: "#000",
                          boxShadow: `0 8px 20px ${cat.color}30`,
                        }
                      : {
                          background: `${cat.color}15`,
                          color: cat.color,
                          border: `1px solid ${cat.color}35`,
                        }
                  }
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`${showArchive}-${catFilter}-${sortBy}-${search}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {displayIdeas.length === 0 ? (
            <div className={`${panelClassName} p-6`}>
              <EmptyState
                icon="💡"
                message={
                  showArchive
                    ? "No archived ideas."
                    : search
                      ? `No ideas matching "${search}"`
                      : "No ideas yet. Capture your first thought!"
                }
                actionLabel={!showArchive && !search ? "Add Idea" : undefined}
                onAction={
                  !showArchive && !search ? () => setShowAdd(true) : undefined
                }
              />
            </div>
          ) : showArchive ? (
            <div className="space-y-3">
              {displayIdeas.map((idea, index) => (
                <motion.div
                  key={idea._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`${panelClassName} flex items-center justify-between gap-4 p-4 opacity-80`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
                      {idea.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {idea.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => unarchiveIdea(idea._id)}
                    >
                      ↩ Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteIdea(idea._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {displayIdeas.map((idea, index) => (
                <motion.div
                  key={idea._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035 }}
                >
                  <IdeaCard
                    idea={idea}
                    categories={categories}
                    onEdit={setEditIdea}
                    onDelete={deleteIdea}
                    onArchive={archiveIdea}
                    onToggleFavorite={toggleFavorite}
                    onTogglePin={togglePin}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* Stats */}
      {!showArchive && activeIdeasCount > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.24 }}
          className="grid gap-3 sm:grid-cols-3"
        >
          <div className={`${panelClassName} p-4`}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Total Ideas
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {activeIdeasCount}
            </p>
          </div>

          <div className={`${panelClassName} p-4`}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Favorites
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {favoriteCount}
            </p>
          </div>

          <div className={`${panelClassName} p-4`}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Pinned
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {pinnedCount}
            </p>
          </div>
        </motion.section>
      )}

      {/* Modals */}
      <IdeaModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleCreate}
        categories={categories}
      />

      <IdeaModal
        isOpen={!!editIdea}
        onClose={() => setEditIdea(null)}
        onSubmit={handleUpdate}
        initial={editIdea}
        categories={categories}
      />

      <ManageCategoriesModal
        isOpen={showCatMgr}
        onClose={() => setShowCatMgr(false)}
        categories={categories}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </motion.div>
  );
}
