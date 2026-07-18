import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { site, mailto } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${site.name}` },
      { name: "description", content: `Contact ${site.name} for project inquiries and collaborations.` },
      { property: "og:title", content: `Contact — ${site.name}` },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  project_type: z.string().trim().max(120).optional().or(z.literal("")),
  requirements: z.string().trim().max(2000).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(5000),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) return toast.error("Could not send — please try again");
    setDone(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Get in touch</p>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          Contact <span className="gradient-text">{site.name}</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Share project details and we'll respond promptly. For quick inquiries, email us directly.
        </p>
        <a
          href={mailto()}
          className="mt-6 inline-flex items-center gap-2 rounded-full btn-neon px-5 py-3 text-sm font-semibold"
        >
          <Mail className="h-4 w-4" /> Start a Project
        </a>
        <div className="glass mt-8 rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Email</p>
          <a href={`mailto:${site.email}`} className="mt-1 block font-medium hover:text-primary">
            {site.email}
          </a>
        </div>
      </div>

      {done ? (
        <div className="glass rounded-2xl p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Message received.</h2>
          <p className="mt-3 text-muted-foreground">
            Thank you for reaching out to {site.name}. Our team will get back to you soon.
          </p>
          <button
            className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/5"
            onClick={() => setDone(false)}
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="glass grid gap-4 rounded-2xl p-8 md:grid-cols-2">
          <F label="Name" name="name" required />
          <F label="Email" name="email" type="email" required />
          <F label="Contact Number" name="phone" />
          <F label="Company / Production" name="company" />
          <F label="Project Type" name="project_type" placeholder="3D Animation, Product Rendering…" />
          <F label="Expected Timeline" name="timeline" placeholder="e.g. 4-6 weeks" />
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium">Project Requirements</span>
            <textarea
              name="requirements"
              rows={3}
              maxLength={2000}
              className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium">Message <span className="text-primary">*</span></span>
            <textarea
              name="message"
              rows={4}
              required
              maxLength={5000}
              className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            disabled={submitting}
            className="justify-self-start rounded-full btn-neon px-6 py-3 text-sm font-semibold md:col-span-2 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}

function F({
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
