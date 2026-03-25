import { useState } from "react";
import { resetPassword } from "../../firebase";
import Button from "../ui/Button";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return;
    try {
      setLoading(true);
      setError("");
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError("No account found with that email.");
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✉️</div>
        <p className="text-white font-semibold mb-2">Check your email</p>
        <p className="text-zinc-500 text-sm mb-6">
          Password reset link sent to{" "}
          <span className="text-white">{email}</span>
        </p>
        <button
          onClick={onBack}
          className="text-zinc-500 hover:text-white text-sm transition"
        >
          ← Back to Login
        </button>
      </div>
    );

  return (
    <div>
      <h2 className="text-xl font-black tracking-widest text-white mb-1">
        RESET PASSWORD
      </h2>
      <p className="text-zinc-500 text-sm mb-6">
        Enter your email and we'll send a reset link.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <input
          type="email"
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition"
          style={{ borderColor: "var(--color-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "")}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mb-4"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <button
        onClick={onBack}
        className="text-zinc-500 hover:text-white text-sm transition w-full text-center"
      >
        ← Back to Login
      </button>
    </div>
  );
}
