import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/config/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Login — ${site.name}` },
      { name: "description", content: `Sign in to ${site.name}.` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

const emailSchema = z.string().trim().email().max(254);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleGoogle() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Google sign-in failed");
    }
  }

  async function handleEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    if (!email.success) return toast.error("Enter a valid email");

    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset email sent — check your inbox.");
        setMode("signin");
        return;
      }
      const pw = passwordSchema.safeParse(fd.get("password"));
      if (!pw.success) return toast.error(pw.error.issues[0].message);

      if (mode === "signup") {
        const fullName = String(fd.get("full_name") ?? "").trim();
        const { error } = await supabase.auth.signUp({
          email: email.data,
          password: pw.data,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success(
          "Your account has been created successfully. You can now sign in."
        );
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.data,
          password: pw.data,
        });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-6 py-20">
      <div className="glass rounded-2xl p-8">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          {site.name}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          {mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Sign In"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your account.
        </p>

        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-60"
            >
              <GoogleIcon /> Continue with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
            </div>
          </>
        )}

        <form onSubmit={handleEmail} className="grid gap-4">
          {mode === "signup" && (
            <Input label="Full Name" name="full_name" required />
          )}
          <Input label="Email" name="email" type="email" required />
          {mode !== "forgot" && (
            <Input label="Password" name="password" type="password" required minLength={8} />
          )}
          <button
            disabled={busy}
            className="rounded-full btn-neon px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create Account"
                : mode === "forgot"
                  ? "Send Reset Link"
                  : "Sign In with Email"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              <button className="hover:text-foreground" onClick={() => setMode("forgot")}>
                Forgot Password?
              </button>
              <button className="hover:text-foreground" onClick={() => setMode("signup")}>
                Create New Account
              </button>
            </>
          ) : (
            <button className="hover:text-foreground" onClick={() => setMode("signin")}>
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  name,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}
