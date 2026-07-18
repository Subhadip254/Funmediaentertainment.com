import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Fun Media Entertainment" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <div className="glass rounded-2xl p-8">
        <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {ready ? "Enter your new password below." : "Waiting for recovery link…"}
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">New Password</span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            disabled={!ready || busy}
            className="rounded-full btn-neon px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
