import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../firebase";
import defaultAvatar from "../../assets/avatar.jpg";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: "⊞" },
  { to: "/habits", label: "Habits", icon: "◎" },
  { to: "/goals", label: "Goals", icon: "◈" },
  { to: "/journal", label: "Journal", icon: "✎" },
  { to: "/progress", label: "Progress", icon: "↗" },
  { to: "/ideas", label: "Ideas", icon: "💡" },
  { to: "/templates", label: "Templates", icon: "📋" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const MIN_WIDTH = 220;
const MAX_WIDTH = 380;
const DEFAULT_WIDTH = 260;

function SidebarItem({ to, label, icon, isCollapsed, index }) {
  return (
    <NavLink to={to} end={to === "/"}>
      {({ isActive }) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04 }}
          whileHover={{ x: 4 }}
          className={`group relative flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all ${
            isActive
              ? "text-[var(--color-primary)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {/* Active Indicator */}
          {isActive && (
            <motion.div
              layoutId="activeNav"
              className="absolute left-0 h-full w-1 rounded-r bg-[var(--color-primary)]"
            />
          )}

          {/* Icon */}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition">
            <span className="text-base">{icon}</span>
          </div>

          {/* Label */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </NavLink>
  );
}

function UserSection({ user, isCollapsed }) {
  return (
    <div className="px-4 py-4 border-t border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={user?.photoURL || defaultAvatar}
          className="w-8 h-8 rounded-full object-cover border border-white/10"
        />

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <p className="text-sm text-white truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={logout}
        className="w-full text-xs text-zinc-500 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg py-2 transition"
      >
        Sign out
      </button>
    </div>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("sidebarWidth");
    return saved ? parseInt(saved) : DEFAULT_WIDTH;
  });

  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));

      setSidebarWidth(newWidth);
      localStorage.setItem("sidebarWidth", newWidth);
      setIsCollapsed(newWidth <= MIN_WIDTH + 20);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    if (isResizing) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const resetWidth = () => {
    setSidebarWidth(DEFAULT_WIDTH);
    setIsCollapsed(false);
    localStorage.setItem("sidebarWidth", DEFAULT_WIDTH);
  };

  return (
    <>
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", damping: 25 }}
        className="relative flex h-screen flex-col border-r border-white/10 bg-black"
      >
        {/* Header */}
        <div className="px-5 py-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wide text-white">
            DAILY LIFE
          </h1>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs mt-1 text-zinc-500"
              >
                Personal growth system
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <p className="px-5 mb-3 text-xs uppercase tracking-widest text-zinc-600">
            Menu
          </p>

          <div className="space-y-1">
            {navItems.map((item, i) => (
              <SidebarItem
                key={item.to}
                {...item}
                index={i}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>

        {/* User */}
        <UserSection user={user} isCollapsed={isCollapsed} />
      </motion.aside>

      {/* Resize Handle */}
      <div
        className="fixed top-0 bottom-0 w-1 cursor-ew-resize z-50"
        style={{ left: `${sidebarWidth - 2}px` }}
        onMouseDown={startResizing}
        onDoubleClick={resetWidth}
      />
    </>
  );
}
