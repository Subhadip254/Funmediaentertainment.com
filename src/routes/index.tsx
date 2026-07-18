import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { site, mailto, services, crew } from "@/config/site";

const Hero3D = lazy(() => import("@/components/Hero3D"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — Creative Animation Studio` },
      {
        name: "description",
        content:
          "Professional 3D & 2D animation, modeling, texturing, rigging, lighting and rendering by Fun Media Entertainment.",
      },
      { property: "og:title", content: `${site.name} — Creative Animation Studio` },
      { property: "og:description", content: site.description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <CrewTeaser />
      <RatingsTeaser />
      <CTASection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[92vh] flex items-center hero-text-fade">
      {/* Animated water background — untouched */}
      <div className="absolute inset-0 -z-10 opacity-70">
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </div>

      {/* Two-column hero layout */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">

          {/* ── LEFT: text column ── */}
          <div className="flex-1 max-w-[520px] animate-fade-up z-10">
            {/* Badge */}
            <span className="hero-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5 text-[#38CFFF]" />
              <span style={{ color: '#DCE7F7' }}>{site.name}</span>
            </span>

            {/* Heading — flat, bold, readable */}
            <h1 className="hero-heading font-bold tracking-tight">
              <span className="hero-heading-line">Create Imaginative</span>
              <span className="hero-heading-gradient">Worlds</span>
              <span className="hero-heading-line">Through Animation</span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-md text-[1.05rem] leading-relaxed" style={{ color: '#AAB8CC' }}>
              {site.description}
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/portfolio"
                className="hero-btn-primary group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
              >
                Explore Our Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/crew"
                className="hero-btn-secondary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Meet Our Team
              </Link>
              <a
                href={mailto()}
                className="hero-btn-secondary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Start a Project
              </a>
            </div>
          </div>

          {/* ── RIGHT: 3D sphere column ── */}
          <div
            className="flex-1 relative hidden md:flex items-center justify-center"
            style={{ height: '520px', minWidth: '400px', maxWidth: '560px' }}
            aria-hidden="true"
          />

        </div>
      </div>
    </section>
  );
}

function ServicesTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            What we craft
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Services by {site.shortName}
          </h2>
        </div>
        <Link
          to="/services"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all services →
        </Link>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((s) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ??
            Icons.Sparkles;
          return (
            <div
              key={s.title}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CrewTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        The people behind {site.shortName}
      </p>
      <h2 className="mt-3 flex items-center gap-3 font-display text-4xl font-semibold md:text-5xl">
        <Icons.Users className="h-8 w-8 text-primary" /> Crew of {site.name}
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {crew.map((c) => (
          <div key={c.name} className="glass rounded-2xl p-5 group transition-transform hover:-translate-y-1">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 relative">
              {c.photo ? (
                <img
                  src={c.photo}
                  alt={c.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.User className="h-16 w-16 text-primary/40" />
                </div>
              )}
            </div>
            <h3 className="mt-4 font-semibold">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.role}</p>
            {c.intro && (
              <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed">{c.intro}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="glass relative overflow-hidden rounded-3xl p-10 md:p-16 text-center">
        <div className="hero-glow absolute inset-0 -z-10" aria-hidden />
        <h2 className="font-display text-3xl font-semibold md:text-5xl">
          Have a project in mind?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Reach out to {site.name} and let's craft something imaginative together.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={mailto()}
            className="rounded-full btn-neon px-6 py-3 text-sm font-semibold"
          >
            Start a Project
          </a>
          <Link
            to="/contact"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}



import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function RatingsTeaser() {
  const [reviews, setReviews] = useState<{ name: string; role: string; comment: string; rating: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchRatings() {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) {
        setReviews(
          data.map((r) => ({
            name: r.name,
            role: r.role,
            comment: r.comments,
            rating: r.rating,
          }))
        );
      }
      setLoading(false);
    }
    fetchRatings();
  }, []);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-5xl">
          What People <span className="gradient-text">Say</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          5-star ratings from our amazing clients and team members.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center text-muted-foreground">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="flex justify-center text-muted-foreground">No reviews yet. Be the first!</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {displayedReviews.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-fade-up">
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm italic text-muted-foreground">"{r.comment}"</p>
              <div className="mt-4">
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {reviews.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            {showAll ? "See Less Feedback" : "See More Feedback"}
          </button>
        )}
        <Link
          to="/ratings"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Leave a Review <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
