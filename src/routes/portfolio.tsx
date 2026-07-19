import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { artistWorks, type ArtistWork } from "@/data/crewData";
import { useState, useCallback, useEffect } from "react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: `Portfolio — ${site.name}` },
      {
        name: "description",
        content: `Selected animation, rigging, modeling, texturing, and rendering work by ${site.name}.`,
      },
      { property: "og:title", content: `Portfolio — ${site.name}` },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

// ─── Category Definitions ─────────────────────────────────────────────────────

type PortfolioCategory = {
  id: string;
  label: string;               // display title on the card
  categoryKey: string;         // matches ArtistWork.category
  color: string;               // accent hex color
  description: string;         // short card description
};

const CATEGORIES: PortfolioCategory[] = [
  {
    id: "3d-modeling",
    label: "3D Modeling",
    categoryKey: "3D Modeling",
    color: "#6a80ff",
    description: "Characters, environments, props, vehicles and product models built for production.",
  },
  {
    id: "texturing",
    label: "Texturing",
    categoryKey: "Texturing",
    color: "#a855f7",
    description: "PBR and stylized surface textures for characters, props and products.",
  },
  {
    id: "animation",
    label: "Animation",
    categoryKey: "Animation",
    color: "#ffdf6a",
    description: "Character performance, creature cycles, and cinematic motion work.",
  },
  {
    id: "rigging",
    label: "Rigging",
    categoryKey: "Rigging",
    color: "#ff6a80",
    description: "Animator-friendly character, creature, and mechanical rigs.",
  },
  {
    id: "lighting-rendering",
    label: "Lighting & Rendering",
    categoryKey: "Product Lighting & Rendering",
    color: "#80ff6a",
    description: "Studio lighting setups, packshots, and high-fidelity product renders.",
  },
  {
    id: "2d-animation",
    label: "2D Animation",
    categoryKey: "2D Animation",
    color: "#35d8ff",
    description: "Character animation, motion graphics, and digital storytelling in 2D.",
  },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  work,
  works,
  imageIndex,
  onClose,
  onPrevWork,
  onNextWork,
  onSetImage,
}: {
  work: ArtistWork;
  works: ArtistWork[];
  imageIndex: number;
  onClose: () => void;
  onPrevWork: () => void;
  onNextWork: () => void;
  onSetImage: (i: number) => void;
}) {
  const cat = CATEGORIES.find((c) => c.categoryKey === work.category);
  const accent = cat?.color ?? "#35d8ff";
  const images = work.images.length > 0 ? work.images : [work.thumbnail];
  const currentImg = images[imageIndex] ?? work.thumbnail;

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNextWork();
      if (e.key === "ArrowLeft") onPrevWork();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onNextWork, onPrevWork]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} — detail view`}
      id="portfolio-lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl border border-white/12 overflow-hidden max-h-[92vh] flex flex-col"
        style={{ background: "rgba(14,14,22,0.97)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id="lightbox-close"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image / video area */}
        <div className="relative aspect-video flex-shrink-0 bg-black/60 overflow-hidden">
          <img
            src={currentImg}
            alt={`${work.title} image ${imageIndex + 1}`}
            className="h-full w-full object-cover"
          />
          {works.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrevWork}
                aria-label="Previous project"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onNextWork}
                aria-label="Next project"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSetImage(i)}
                  aria-label={`Image ${i + 1}`}
                  className="w-2 h-2 rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background: i === imageIndex ? accent : "rgba(255,255,255,0.4)",
                    transform: i === imageIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <span
              className="inline-block rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider border"
              style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}
            >
              {work.category} › {work.subcategory}
            </span>
            <h2
              className="mt-2 font-display text-2xl font-bold"
              style={{ color: accent }}
            >
              {work.title}
            </h2>
          </div>
          <div className="border-t border-white/6 pt-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">
              Description
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {work.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Work Thumbnail Card (inside gallery) ─────────────────────────────────────

function WorkCard({
  work,
  onClick,
}: {
  work: ArtistWork;
  onClick: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.categoryKey === work.category);
  const accent = cat?.color ?? "#35d8ff";

  return (
    <button
      type="button"
      id={`work-${work.id}`}
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ background: "rgba(18,18,28,0.9)" }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-black/40">
        <img
          src={work.thumbnail}
          alt={work.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* subcategory badge */}
        <span
          className="absolute top-2.5 left-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm"
          style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}
        >
          {work.subcategory}
        </span>
      </div>

      {/* Footer */}
      <div className="px-4 py-3">
        <p className="font-semibold text-sm text-white group-hover:text-white/90 transition-colors truncate">
          {work.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {work.description}
        </p>
      </div>
    </button>
  );
}

// ─── Category Card (main portfolio view — reference image style) ──────────────

function CategoryCard({
  cat,
  workCount,
  onClick,
}: {
  cat: PortfolioCategory;
  workCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      id={`cat-${cat.id}`}
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ background: "rgba(14,14,22,0.9)" }}
    >
      {/* Top — large colored title centered */}
      <div
        className="relative flex items-center justify-center px-6 py-10 min-h-[160px] overflow-hidden"
        style={{ background: "rgba(10,10,20,0.92)" }}
      >
        {/* background radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity duration-400"
          style={{
            background: `radial-gradient(ellipse at center, ${cat.color} 0%, transparent 70%)`,
          }}
        />
        <span
          className="relative font-display font-bold text-2xl md:text-3xl text-center leading-tight transition-transform duration-300 group-hover:scale-105"
          style={{
            color: cat.color,
            textShadow: `0 0 40px ${cat.color}55`,
          }}
        >
          {cat.label}
        </span>
      </div>

      {/* Bottom strip */}
      <div className="px-5 py-4 border-t border-white/6">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: `${cat.color}99` }}
        >
          {cat.label}
        </p>
        <p className="font-semibold text-sm text-white mb-1 leading-snug">
          {workCount} {workCount === 1 ? "project" : "projects"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {cat.description}
        </p>
      </div>
    </button>
  );
}

// ─── Gallery View (when a category is clicked) ────────────────────────────────

function GalleryView({
  cat,
  works,
  onBack,
}: {
  cat: PortfolioCategory;
  works: ArtistWork[];
  onBack: () => void;
}) {
  const [selectedWork, setSelectedWork] = useState<ArtistWork | null>(null);
  const [imageIdx, setImageIdx] = useState(0);

  const open = useCallback((w: ArtistWork) => {
    setSelectedWork(w);
    setImageIdx(0);
  }, []);

  const close = useCallback(() => setSelectedWork(null), []);

  const nextWork = useCallback(() => {
    if (!selectedWork) return;
    const i = works.findIndex((w) => w.id === selectedWork.id);
    setSelectedWork(works[(i + 1) % works.length]);
    setImageIdx(0);
  }, [selectedWork, works]);

  const prevWork = useCallback(() => {
    if (!selectedWork) return;
    const i = works.findIndex((w) => w.id === selectedWork.id);
    setSelectedWork(works[(i - 1 + works.length) % works.length]);
    setImageIdx(0);
  }, [selectedWork, works]);

  return (
    <div>
      {/* Gallery header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="font-display text-3xl md:text-4xl font-bold"
            style={{ color: cat.color, textShadow: `0 0 40px ${cat.color}44` }}
          >
            {cat.label}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {works.length} {works.length === 1 ? "project" : "projects"} in this category
          </p>
        </div>

        <button
          type="button"
          id="back-to-categories"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio Categories
        </button>
      </div>

      {/* Divider */}
      <div
        className="mb-8 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${cat.color}66, transparent)`,
        }}
      />

      {/* Works grid */}
      {works.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-muted-foreground text-sm">
            No projects in this category yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <WorkCard key={w.id} work={w} onClick={() => open(w)} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedWork && (
        <Lightbox
          work={selectedWork}
          works={works}
          imageIndex={imageIdx}
          onClose={close}
          onNextWork={nextWork}
          onPrevWork={prevWork}
          onSetImage={setImageIdx}
        />
      )}
    </div>
  );
}

// ─── Portfolio Page ───────────────────────────────────────────────────────────

function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | null>(null);

  // Scroll to top when entering a category gallery
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  // Works for the active category
  const galleryWorks = activeCategory
    ? artistWorks.filter((w) => w.category === activeCategory.categoryKey)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      {activeCategory === null ? (
        /* ── CATEGORIES VIEW ────────────────────────────── */
        <>
          {/* Header */}
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold text-center">
            Selected work
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl text-center text-white">
            <span className="gradient-text">Portfolio</span> of {site.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground text-sm">
            Click a category to explore the work created by our artists.
          </p>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Category cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const count = artistWorks.filter(
                (w) => w.category === cat.categoryKey
              ).length;
              return (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  workCount={count}
                  onClick={() => setActiveCategory(cat)}
                />
              );
            })}
          </div>
        </>
      ) : (
        /* ── GALLERY VIEW ───────────────────────────────── */
        <GalleryView
          cat={activeCategory}
          works={galleryWorks}
          onBack={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}
