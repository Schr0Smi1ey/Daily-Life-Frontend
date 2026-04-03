import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import useProfile from "../hooks/useProfile";
import defaultAvatar from "../assets/avatar.jpg";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

const VIEW_OPTIONS = [
  { value: "dashboard", label: "Dashboard", icon: "⊞" },
  { value: "habits", label: "Habits", icon: "◎" },
  { value: "goals", label: "Goals", icon: "◈" },
  { value: "journal", label: "Journal", icon: "✎" },
];

const WEEK_OPTIONS = [
  { value: "sunday", label: "Sunday", icon: "📅" },
  { value: "monday", label: "Monday", icon: "📆" },
  { value: "saturday", label: "Saturday", icon: "🗓️" },
];

const COLOR_PRESETS = [
  "#f97316",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#eab308",
  "#ec4899",
  "#14b8a6",
];

function SectionCard({
  eyebrow,
  title,
  description,
  children,
  danger = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl ${
        danger
          ? "border-red-500/20 bg-red-500/[0.04]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-[-40px] h-44 w-44 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        {!danger && (
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
        )}
      </div>

      <div className="relative p-6 md:p-7">
        <div className="mb-6">
          <p
            className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] ${
              danger ? "text-red-400/80" : "text-zinc-500"
            }`}
          >
            {eyebrow}
          </p>
          <h2
            className={`text-xl md:text-2xl font-semibold tracking-tight ${
              danger ? "text-red-100" : "text-white"
            }`}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}

function OptionButton({ active, onClick, icon, label }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 ${
        active
          ? "border-transparent text-black shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
      }`}
      style={active ? { backgroundColor: "var(--color-primary)" } : {}}
    >
      <span className="relative flex items-center justify-center gap-2.5">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </span>
    </motion.button>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();

  const {
    profile,
    loading,
    saving,
    error,
    updateProfile,
    uploadProfileAvatar,
    exportData,
    deleteAccount,
  } = useProfile();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 40,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.displayName || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    await updateProfile({ displayName: name, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSavePrefs = async (newPrefs) => {
    await updateProfile({
      preferences: {
        ...profile?.preferences,
        ...newPrefs,
      },
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image (JPEG, PNG, or WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result);
    reader.readAsDataURL(file);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    await uploadProfileAvatar(file);
    clearInterval(interval);
    setUploadProgress(100);

    setTimeout(() => {
      setPreviewUrl(null);
      setUploadProgress(0);
    }, 500);
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    await deleteAccount();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const prefs = profile?.preferences || {};
  const avatar =
    previewUrl || profile?.photoURL || user?.photoURL || defaultAvatar;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-8" data-aos="fade-up">
        <PageHeader
          title="PROFILE"
          subtitle="Manage your account, appearance, and personal preferences."
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="mb-6"
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 backdrop-blur-xl">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div data-aos="fade-up" data-aos-delay="100">
            <SectionCard
              eyebrow="Identity"
              title="Profile photo"
              description="Choose a clean, recognizable image for your account."
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="relative mb-5"
                >
                  <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20 blur-2xl" />
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="relative h-28 w-28 rounded-full border-2 border-white/15 object-cover shadow-2xl ring-4 ring-[var(--color-primary)]/20"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />

                  {(saving || uploadProgress > 0) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/65 backdrop-blur-sm"
                    >
                      {uploadProgress > 0 && uploadProgress < 100 ? (
                        <>
                          <div className="mb-2 h-8 w-8 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                          <span className="text-xs font-medium text-white">
                            {uploadProgress}%
                          </span>
                        </>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                      )}
                    </motion.div>
                  )}
                </motion.div>

                <h3 className="text-lg font-semibold text-white">
                  {name || user?.displayName || "Your profile"}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  JPG, PNG, WEBP — maximum 5MB
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Hosted securely via ImgBB
                </p>

                <div className="mt-5 w-full">
                  <Button
                    size="md"
                    onClick={() => fileRef.current?.click()}
                    disabled={saving}
                    className="w-full"
                  >
                    📸 Upload New Photo
                  </Button>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </SectionCard>
          </div>

          <div data-aos="fade-up" data-aos-delay="150">
            <SectionCard
              eyebrow="Account"
              title="Export your data"
              description="Download your habits, goals, journal entries, and achievements as a JSON backup."
            >
              <div className="flex flex-col gap-4">
                <div className="text-sm text-zinc-400">
                  Keep a portable copy of your data anytime.
                </div>
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
                  <Button variant="ghost" onClick={exportData}>
                    📥 Download My Data
                  </Button>
                </motion.div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="space-y-6">
          <div data-aos="fade-up" data-aos-delay="200">
            <SectionCard
              eyebrow="Personal details"
              title="Profile information"
              description="Update your visible account information and keep your profile polished."
            >
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Display name
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-[var(--color-primary)] focus:bg-white/[0.06] focus:ring-4 focus:ring-[var(--color-primary)]/15"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-24 text-sm text-zinc-400"
                      value={user?.email || ""}
                      disabled
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      Verified
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Managed by Google Authentication
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      Bio
                    </label>
                    <span className="text-xs text-zinc-500">
                      {bio.length}/200
                    </span>
                  </div>
                  <textarea
                    className="min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-[var(--color-primary)] focus:bg-white/[0.06] focus:ring-4 focus:ring-[var(--color-primary)]/15"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    💾 {saving ? "Saving..." : "Save Profile"}
                  </Button>

                  <AnimatePresence>
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300"
                      >
                        ✓ Saved successfully
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionCard>
          </div>

          <div data-aos="fade-up" data-aos-delay="250">
            <SectionCard
              eyebrow="Experience"
              title="Preferences"
              description="Personalize how the app looks and where it lands when you sign in."
            >
              <div className="space-y-8">
                <div>
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Theme
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {THEME_OPTIONS.map((t) => (
                      <OptionButton
                        key={t.value}
                        active={theme === t.value}
                        icon={t.icon}
                        label={t.label}
                        onClick={() => {
                          setTheme(t.value);
                          handleSavePrefs({ theme: t.value });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Primary color
                  </label>

                  <div className="mb-5 flex flex-wrap gap-3">
                    {COLOR_PRESETS.map((c) => {
                      const active = primaryColor === c;

                      return (
                        <motion.button
                          key={c}
                          type="button"
                          whileHover={{ y: -2, scale: 1.06 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            setPrimaryColor(c);
                            handleSavePrefs({ primaryColor: c });
                          }}
                          className="relative h-11 w-11 rounded-full transition-all"
                          style={{ background: c }}
                        >
                          <span
                            className={`absolute inset-0 rounded-full border-2 ${
                              active ? "border-white" : "border-transparent"
                            }`}
                          />
                          {active && (
                            <span
                              className="absolute -inset-1 rounded-full border"
                              style={{ borderColor: `${c}66` }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      onBlur={(e) =>
                        handleSavePrefs({ primaryColor: e.target.value })
                      }
                      className="h-12 w-14 cursor-pointer rounded-xl border border-white/10 bg-transparent"
                    />
                    <div>
                      <p className="font-mono text-sm text-white">
                        {primaryColor}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Choose a custom accent color
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Default view after login
                  </label>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {VIEW_OPTIONS.map((v) => (
                      <OptionButton
                        key={v.value}
                        active={prefs.defaultView === v.value}
                        icon={v.icon}
                        label={v.label}
                        onClick={() =>
                          handleSavePrefs({ defaultView: v.value })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Week starts on
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {WEEK_OPTIONS.map((w) => (
                      <OptionButton
                        key={w.value}
                        active={prefs.weekStart === w.value}
                        icon={w.icon}
                        label={w.label}
                        onClick={() => handleSavePrefs({ weekStart: w.value })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <SectionCard
              eyebrow="Restricted action"
              title="Danger zone"
              description="Permanently delete your account and all associated data. This action cannot be undone."
              danger
            >
              <AnimatePresence mode="wait">
                {!showDelete ? (
                  <motion.div
                    key="delete-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      variant="danger"
                      onClick={() => setShowDelete(true)}
                    >
                      ⚠️ Delete Account
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="delete-confirm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-2xl border border-red-500/25 bg-red-500/10 p-4"
                  >
                    <p className="mb-3 text-sm font-medium text-red-200">
                      Type{" "}
                      <span className="rounded-md bg-red-500/20 px-2 py-1 font-mono text-red-100">
                        DELETE
                      </span>{" "}
                      to confirm account deletion.
                    </p>

                    <input
                      className="mb-3 w-full rounded-2xl border border-red-500/30 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                      placeholder="Type DELETE here"
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      autoFocus
                    />

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        disabled={deleteInput !== "DELETE" || saving}
                      >
                        {saving ? "Deleting..." : "🔴 Confirm Delete"}
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowDelete(false);
                          setDeleteInput("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
