import { createFileRoute } from "@tanstack/react-router";
import { crew, site } from "@/config/site";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/crew")({
  head: () => ({
    meta: [
      { title: `Crew — ${site.name}` },
      { name: "description", content: `Meet the crew of ${site.name}.` },
      { property: "og:title", content: `Crew — ${site.name}` },
      { property: "og:url", content: "/crew" },
    ],
    links: [{ rel: "canonical", href: "/crew" }],
  }),
  component: CrewPage,
});

function CrewPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Our team</p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
        Crew of <span className="gradient-text">{site.name}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A small, focused team of creatives and technologists.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {crew.map((c) => (
          <article key={c.name} className="glass group rounded-2xl p-5 transition-all hover:-translate-y-1">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10">
              {c.photo && (
                <img
                  src={c.photo}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-0 transition-opacity duration-500 [&:not([src=''])]:opacity-100"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
            <h3 className="mt-4 font-display font-semibold">{c.name}</h3>
            <p className="text-sm text-primary">{c.role}</p>
            {c.intro && <p className="mt-2 text-sm text-muted-foreground">{c.intro}</p>}
            {c.link && (
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Portfolio <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
