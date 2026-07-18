import { createFileRoute } from "@tanstack/react-router";
import { portfolio, site } from "@/config/site";
import { Clapperboard } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: `Portfolio — ${site.name}` },
      {
        name: "description",
        content: `Selected animation and production work by ${site.name}.`,
      },
      { property: "og:title", content: `Portfolio — ${site.name}` },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Selected work</p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
        <span className="gradient-text">Portfolio</span> of {site.name}
      </h1>

      {portfolio.length === 0 ? (
        <div className="mt-16 glass rounded-3xl px-8 py-32 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl btn-neon">
            <Clapperboard className="h-8 w-8" />
          </div>
          <h2 className="mt-8 font-display text-2xl font-semibold md:text-3xl">
            Our latest work will be published here soon.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {site.name} is currently curating a selection of new projects. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => (
            <article key={p.title} className="glass rounded-2xl overflow-hidden">
              <img src={p.thumbnail} alt={p.title} className="aspect-video w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.category}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{p.title}</h3>
                {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
