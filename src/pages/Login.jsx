import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from "../firebase";
import ForgotPassword from "../components/auth/ForgotPassword";
import api from "../api";

const ERROR_MESSAGES = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/invalid-credential": "Incorrect email or password.",
};

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("login"); // login | signup
  const [showForgot, setShowForgot] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .get("/api/users/me")
      .then((res) => {
        const view = res.data?.preferences?.defaultView || "dashboard";
        navigate(view === "dashboard" ? "/" : `/${view}`);
      })
      .catch(() => navigate("/"));
  }, [user]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
  };

  const handleTabSwitch = (t) => {
    setTab(t);
    clearForm();
  };

  // ── Google login ───────────────────────────────────────────────────────
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email login ────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    try {
      setLoading(true);
      setError("");
      await loginWithEmail(email, password);
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email signup ───────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      setLoading(true);
      setError("");
      await registerWithEmail(email, password, name);
      // AuthContext will detect unverified email and show verify screen
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password screen ─────────────────────────────────────────────
  if (showForgot)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-8">
          <ForgotPassword onBack={() => setShowForgot(false)} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Logo Section - Horizontal with Form */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="lg:w-2/5 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-widest text-white mb-2">
                  DAILY LIFE
                </h1>
                <p className="text-[var(--color-primary)] text-xs sm:text-sm tracking-widest uppercase font-semibold mb-6">
                  Personal Development
                </p>
                <div className="hidden lg:block space-y-4 mt-8">
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-8 h-0.5 bg-[var(--color-primary)]" />
                    <span>Track your habits</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-8 h-0.5 bg-[var(--color-primary)]" />
                    <span>Set and achieve goals</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-8 h-0.5 bg-[var(--color-primary)]" />
                    <span>Journal your journey</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10">
              {/* Tabs */}
              <div className="flex bg-zinc-800 rounded-xl p-1 mb-6">
                {["login", "signup"].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTabSwitch(t)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition ${
                      tab === t
                        ? "bg-[var(--color-primary)] text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              {/* Form Fields - Responsive Grid */}
              <div className="space-y-4">
                {/* Name field — signup only */}
                {tab === "signup" && (
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                {/* Email and Password - Horizontal on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) =>
                        tab === "login" && e.key === "Enter" && handleLogin()
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-primary)] transition pr-12"
                        placeholder={
                          tab === "signup"
                            ? "Min 6 characters"
                            : "Your password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) =>
                          tab === "login" && e.key === "Enter" && handleLogin()
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs transition"
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm password — signup only */}
                {tab === "signup" && (
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-primary)] transition"
                      placeholder="Repeat password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    />
                  </div>
                )}

                {/* Forgot password — login only */}
                {tab === "login" && (
                  <div className="text-right">
                    <button
                      onClick={() => setShowForgot(true)}
                      className="text-xs text-zinc-500 hover:text-white transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={tab === "login" ? handleLogin : handleSignup}
                  disabled={loading}
                  className="w-full bg-[var(--color-primary)] hover:opacity-90 text-black font-bold py-3.5 rounded-xl transition text-sm disabled:opacity-40 mt-2"
                >
                  {loading
                    ? "Please wait..."
                    : tab === "login"
                      ? "Sign In"
                      : "Create Account"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-zinc-600 text-xs">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-semibold py-3.5 rounded-xl transition text-sm disabled:opacity-40"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-4 h-4"
                  />
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-zinc-700 text-xs text-center mt-6">
          Your data is private and tied to your account only.
        </p>
      </div>
    </div>
  );
}
