import { createFileRoute, notFound } from "@tanstack/react-router";
import { site } from "@/config/site";
import {
  ArrowLeft,
  Crown,
  Briefcase,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Linkedin,
  Mail,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { getCrewMember, getArtistWorks, type CrewCategory, type ArtistWork } from "@/data/crewData";
import { useState, useCallback, useEffect } from "react";
import type React from "react";

export const Route = createFileRoute("/crew/$slug/")({
  loader: ({ params }) => {
    const member = getCrewMember(params.slug);
    if (!member) throw notFound();
    return member;
  },
  head: (ctx) => {
    const m = ctx.loaderData;
    return {
      meta: [
        {
          title: m
            ? `${m.name} — ${site.name}`
            : `Profile — ${site.name}`,
        },
        {
          name: "description",
          content: m
            ? `${m.name}, ${m.role} at ${site.name}. ${m.intro}`
            : `Meet the crew of ${site.name}.`,
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold gradient-text">404</p>
        <h1 className="mt-4 text-xl font-semibold font-display text-white">
          Crew member not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This profile doesn't exist.
        </p>
        <a
          href="/crew"
          className="mt-6 inline-flex items-center gap-2 rounded-lg btn-neon px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Crew
        </a>
      </div>
    </div>
  ),
  component: ProfilePage,
});

type AccentSet = {
  badge: string;
  label: string;
  dot: string;
  Icon: React.FC<{ className?: string }>;
};

const CATEGORY_ACCENTS: Record<CrewCategory, AccentSet> = {
  leadership: {
    badge: "bg-amber-400/10 border-amber-400/30 text-amber-400",
    label: "Leadership",
    dot: "bg-amber-400",
    Icon: Crown,
  },
  management: {
    badge: "bg-cyan-400/10 border-cyan-400/30 text-cyan-400",
    label: "Management & Technology",
    dot: "bg-cyan-400",
    Icon: Briefcase,
  },
  investors: {
    badge: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400",
    label: "Investor",
    dot: "bg-emerald-400",
    Icon: TrendingUp,
  },
  artists: {
    badge: "bg-violet-400/10 border-violet-400/30 text-violet-400",
    label: "Creative Artist",
    dot: "bg-violet-400",
    Icon: Sparkles,
  },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-base font-semibold flex items-center gap-3 text-foreground/80">
      <span className="block w-6 h-px bg-gradient-to-r from-primary to-accent flex-shrink-0" />
      {children}
      <span className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
    </h2>
  );
}

// ─── Lightbox Component ───────────────────────────────────────────────────────

function Lightbox({
  work,
  allWorks,
  imageIndex,
  onClose,
  onPrevWork,
  onNextWork,
  onPrevImage,
  onNextImage,
  workIndex,
}: {
  work: ArtistWork;
  allWorks: ArtistWork[];
  imageIndex: number;
  onClose: () => void;
  onPrevWork: () => void;
  onNextWork: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  workIndex: number;
}) {
  const images = work.images.length > 0 ? work.images : [work.thumbnail];
  const currentImg = images[imageIndex] ?? work.thumbnail;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNextWork();
      if (e.key === "ArrowLeft") onPrevWork();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNextWork, onPrevWork]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} — detail view`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl glass rounded-3xl border border-white/12 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 rounded-full bg-black/60 backdrop-blur-sm p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute top-4 left-4 z-20 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs text-muted-foreground">
          {workIndex + 1} / {allWorks.length}
        </div>

        <div className="relative aspect-video flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent/10 overflow-hidden">
          <img
            src={currentImg}
            alt={`${work.title} — image ${imageIndex + 1}`}
            className="h-full w-full object-cover"
          />

          {allWorks.length > 1 && (
            <>
              <button
                onClick={onPrevWork}
                aria-label="Previous project"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-sm p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onNextWork}
                aria-label="Next project"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-sm p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => (idx < imageIndex ? onPrevImage() : onNextImage())}
                  aria-label={`Image ${idx + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === imageIndex
                      ? "bg-white scale-125"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-left">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
                {work.category}
              </span>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                {work.title}
              </h2>
              <p className="text-sm text-primary mt-0.5">{work.contribution}</p>
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {work.description}
          </p>

          {work.software.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {work.software.map((sw) => (
                <span
                  key={sw}
                  className="rounded-full px-3 py-1 text-xs bg-accent/10 border border-accent/20 text-accent"
                >
                  {sw}
                </span>
              ))}
            </div>
          )}

          {work.videoUrl && (
            <div className="mt-4">
              <a
                href={work.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-neon rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Showreel
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          )}

          {allWorks.length > 1 && (
            <div className="mt-6 flex justify-between text-xs text-muted-foreground border-t border-white/5 pt-4">
              <button
                onClick={onPrevWork}
                className="hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous Project
              </button>
              <button
                onClick={onNextWork}
                className="hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next Project
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Page Component ──────────────────────────────────────────────

function ProfilePage() {
  const member = Route.useLoaderData();
  const accent = CATEGORY_ACCENTS[member.category];

  // Fetch works if artist
  const works = member.isArtist ? getArtistWorks(member.slug) : [];

  // Lightbox State
  const [selectedWorkIdx, setSelectedWorkIdx] = useState<number | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const openWork = useCallback((idx: number) => {
    setSelectedWorkIdx(idx);
    setSelectedImageIdx(0);
  }, []);

  const closeWork = useCallback(() => setSelectedWorkIdx(null), []);

  const goNextWork = useCallback(() => {
    setSelectedWorkIdx((prev) => {
      if (prev === null) return null;
      return (prev + 1) % works.length;
    });
    setSelectedImageIdx(0);
  }, [works.length]);

  const goPrevWork = useCallback(() => {
    setSelectedWorkIdx((prev) => {
      if (prev === null) return null;
      return (prev - 1 + works.length) % works.length;
    });
    setSelectedImageIdx(0);
  }, [works.length]);

  const goNextImage = useCallback(() => {
    if (selectedWorkIdx === null) return;
    const imgs = works[selectedWorkIdx].images;
    setSelectedImageIdx((prev) => (prev + 1) % (imgs.length || 1));
  }, [selectedWorkIdx, works]);

  const goPrevImage = useCallback(() => {
    if (selectedWorkIdx === null) return;
    const imgs = works[selectedWorkIdx].images;
    setSelectedImageIdx((prev) => (prev - 1 + (imgs.length || 1)) % (imgs.length || 1));
  }, [selectedWorkIdx, works]);

  const currentWork =
    selectedWorkIdx !== null ? works[selectedWorkIdx] : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 animate-fade-up">
      {/* Back button */}
      <a
        href="/crew"
        id="back-to-crew"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-12"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
        Back to Crew
      </a>

      {/* Hero card */}
      <div className="glass rounded-3xl border border-white/8 p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-shrink-0 self-start">
          <div className="relative w-full max-w-[220px] mx-auto md:mx-0 md:w-52 lg:w-60 aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10">
            {member.photo && (
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover opacity-0 transition-opacity duration-500 [&:not([src=''])]:opacity-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge} mb-4`}
          >
            <accent.Icon className="w-3 h-3" />
            {accent.label}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-white">
            {member.name}
          </h1>
          <p className="mt-1 text-primary text-base">{member.role}</p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {member.intro}
          </p>

          {/* Social links (Only LinkedIn as per instruction) */}
          {member.socialLinks.linkedin && (
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                id={`social-linkedin-${member.slug}`}
                className="inline-flex items-center gap-1.5 glass border border-white/10 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-white/25 transition-all duration-200 hover:scale-105"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
                <ExternalLink className="w-3 h-3 opacity-40" />
              </a>
            </div>
          )}

          {/* Email section - ONLY for CEO, Co-founder, HR, and Web Developer */}
          {member.contactInfo?.email && (
            <div className="mt-5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
              <a
                href={`mailto:${member.contactInfo.email}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {member.contactInfo.email}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="mt-12">
        <SectionHeading>About</SectionHeading>
        <div className="glass rounded-2xl border border-white/8 p-6 mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {member.bio}
          </p>
        </div>
      </div>

      {/* Experience */}
      {member.experience.length > 0 && (
        <div className="mt-10">
          <SectionHeading>Experience</SectionHeading>
          <div className="mt-4 space-y-4">
            {member.experience.map((exp, i) => (
              <div
                key={i}
                className="glass rounded-2xl border border-white/8 p-6 flex gap-5 group hover:border-white/15 transition-colors duration-200"
              >
                <div className="flex-shrink-0 flex flex-col items-center gap-1 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${accent.dot} ring-2 ring-offset-2 ring-offset-transparent ring-current opacity-80`} />
                  <div className="w-px flex-1 bg-gradient-to-b from-primary/40 to-transparent min-h-[2rem]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="font-display font-semibold text-sm text-white">
                      {exp.title}
                    </h3>
                    <span className="text-xs text-muted-foreground/60 flex-shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-0.5 text-primary">
                    {exp.company}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Software */}
      {(member.skills.length > 0 || member.software.length > 0) && (
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          {member.skills.length > 0 && (
            <div>
              <SectionHeading>Skills</SectionHeading>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full px-3 py-1 text-xs font-medium bg-primary/10 border border-primary/20 text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {member.software.length > 0 && (
            <div>
              <SectionHeading>Software</SectionHeading>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.software.map((sw) => (
                  <span
                    key={sw}
                    className="rounded-full px-3 py-1 text-xs font-medium bg-accent/10 border border-accent/20 text-accent"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Achievements */}
      {member.achievements.length > 0 && (
        <div className="mt-10">
          <SectionHeading>Projects &amp; Achievements</SectionHeading>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {member.achievements.map((ach, i) => (
              <div
                key={i}
                className="glass rounded-2xl border border-white/8 p-5 group hover:border-white/18 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white">
                      {ach.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Portfolio Showcase (Artists Only, Embedded directly as requested) ── */}
      {member.isArtist && works.length > 0 && (
        <div className="mt-12 scroll-mt-24" id="artist-portfolio">
          <SectionHeading>Portfolio Showcase</SectionHeading>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work, idx) => (
              <button
                key={work.id}
                onClick={() => openWork(idx)}
                className="glass group w-full rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_oklch(0.72_0.18_240/0.18)] text-left cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white/90">
                      {work.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-sm leading-snug text-white">
                    {work.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-primary">{work.contribution}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {work.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {work.software.slice(0, 3).map((sw) => (
                      <span
                        key={sw}
                        className="rounded-full px-2 py-0.5 text-xs bg-white/5 border border-white/10 text-muted-foreground"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Inline Lightbox */}
          {currentWork && selectedWorkIdx !== null && (
            <Lightbox
              work={currentWork}
              allWorks={works}
              workIndex={selectedWorkIdx}
              imageIndex={selectedImageIdx}
              onClose={closeWork}
              onNextWork={goNextWork}
              onPrevWork={goPrevWork}
              onNextImage={goNextImage}
              onPrevImage={goPrevImage}
            />
          )}
        </div>
      )}

      {/* Footer back button */}
      <div className="mt-16 flex justify-center">
        <a
          href="/crew"
          className="inline-flex items-center gap-2 glass border border-white/10 rounded-xl px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Crew
        </a>
      </div>
    </div>
  );
}
