import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { site, careerRoles } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: `Careers — ${site.name}` },
      {
        name: "description",
        content: `Apply to join ${site.name}. Submit your portfolio for animation, modeling, rigging, texturing, lighting or web roles.`,
      },
      { property: "og:title", content: `Careers — ${site.name}` },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

const schema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(254),
  role_applying_for: z.enum(careerRoles),
  portfolio_url: z.string().trim().url("Enter a valid URL").max(500),
  message: z.string().trim().max(2000).optional(),
});

function CareersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("career_applications").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit — please try again");
      return;
    }
    setDone(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Careers</p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
        Join <span className="gradient-text">{site.name}</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        <span className="font-medium text-foreground">Production:</span> {site.name}
      </p>
      <p className="mt-2 text-muted-foreground">
        There are currently no open positions. You may still submit your portfolio for future opportunities.
      </p>

      {done ? (
        <div className="glass mt-12 rounded-2xl p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Thank you for applying to {site.name}.</h2>
          <p className="mt-3 text-muted-foreground">
            Our team will review your application and contact you if your profile matches our current requirements.
          </p>
          <button
            className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/5"
            onClick={() => setDone(false)}
          >
            Submit another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="glass mt-12 grid gap-5 rounded-2xl p-8">
          <Field label="Full Name" name="full_name" required />
          <Field label="Email Address" name="email" type="email" required />
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Role Applying For</span>
            <select
              name="role_applying_for"
              required
              defaultValue=""
              className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="" disabled>Select a role…</option>
              {careerRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <Field label="Portfolio Link" name="portfolio_url" type="url" placeholder="https://…" required />
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Message <span className="text-muted-foreground">(optional)</span></span>
            <textarea
              name="message"
              rows={4}
              maxLength={2000}
              className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            disabled={submitting}
            className="mt-2 justify-self-start rounded-full btn-neon px-6 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting…" : `Submit application to ${site.shortName}`}
          </button>
        </form>
      )}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
