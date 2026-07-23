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
    <section className="mx-auto max-w-3xl px-4 py-20">
      <div
        className="rounded-2xl px-8 py-12"
        style={{
          background: "rgba(0, 0, 0, 0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
        }}
      >
        <h1 className="font-display text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4 text-gray-300 leading-relaxed">
          This page describes how {site.name} collects and uses information submitted
          through this website.
        </p>
        <div className="mt-8 space-y-6 text-sm text-gray-300">
          <div>
            <h2 className="text-white font-semibold text-lg">Information We Collect</h2>
            <p className="mt-2">Contact form submissions, career applications, and employee account details.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">How We Use It</h2>
            <p className="mt-2">Solely to respond to inquiries, review applications, and manage employee records.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Data Security</h2>
            <p className="mt-2">
              {site.name} uses secure authentication and role-based access controls to
              protect employee records. Public visitors cannot access employee information.
            </p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Contact</h2>
            <p className="mt-2">
              Questions? Email us at{" "}
              <a href={`mailto:${site.email}`} className="text-primary hover:underline">
                {site.email}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
