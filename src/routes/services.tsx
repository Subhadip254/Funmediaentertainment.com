import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { services, site } from "@/config/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Services — ${site.name}` },
      {
        name: "description",
        content:
          "3D Modeling, Texturing, 3D & 2D Animation, Rigging, and Product Lighting & Rendering services by Fun Media Entertainment.",
      },
      { property: "og:title", content: `Services — ${site.name}` },
      { property: "og:description", content: "Production services by Fun Media Entertainment." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Production Services
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
        <span className="gradient-text">Services</span> by {site.name}
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        End-to-end craftsmanship from asset creation to final render.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ??
            Icons.Sparkles;
          return (
            <article
              key={s.title}
              className="glass group relative overflow-hidden rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(120,140,255,0.35)]"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
              <div className="grid h-12 w-12 place-items-center rounded-xl btn-neon">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-xl font-semibold">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
