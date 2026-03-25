import { useState } from "react";
import { resendVerificationEmail, logout } from "../../firebase";
import { auth } from "../../firebase";
import Button from "../ui/Button";

export default function VerifyEmailScreen() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = auth.currentUser?.email;

  const handleResend = async () => {
    try {
      setLoading(true);
      await resendVerificationEmail();
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Force Firebase to re-check verification status
    auth.currentUser?.reload().then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📧</div>

        <h1 className="text-3xl font-black tracking-widest text-white mb-2">
          VERIFY YOUR EMAIL
        </h1>
        <p className="text-zinc-500 text-sm mb-2">
          We sent a verification link to:
        </p>
        <p className="text-white font-semibold mb-6">{email}</p>

        <p className="text-zinc-500 text-sm mb-8">
          Click the link in the email to activate your account. Check your spam
          folder if you don't see it.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={handleRefresh} className="w-full">
            I've Verified — Continue
          </Button>

          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={loading || sent}
            className="w-full"
          >
            {sent
              ? "✓ Email Sent!"
              : loading
                ? "Sending..."
                : "Resend Verification Email"}
          </Button>

          <button
            onClick={logout}
            className="text-zinc-600 hover:text-zinc-400 text-xs transition mt-2"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
