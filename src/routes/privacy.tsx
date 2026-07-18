import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${site.name}` },
      { name: "description", content: `Privacy Policy for ${site.name}.` },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 prose prose-invert">
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        This page describes how {site.name} collects and uses information submitted
        through this website.
      </p>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="text-foreground font-semibold">Information We Collect</h2>
          <p>Contact form submissions, career applications, and employee account details.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold">How We Use It</h2>
          <p>Solely to respond to inquiries, review applications, and manage employee records.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold">Data Security</h2>
          <p>
            {site.name} uses secure authentication and role-based access controls to
            protect employee records. Public visitors cannot access employee information.
          </p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold">Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a href={`mailto:${site.email}`} className="text-primary hover:underline">
              {site.email}
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
