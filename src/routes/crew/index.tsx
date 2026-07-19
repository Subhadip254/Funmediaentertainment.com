import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import {
  Crown,
  Briefcase,
  TrendingUp,
  Sparkles,
  Star,
  Globe,
  Users,
  Code2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  getCrewByCategory,
  type CrewCategory,
  type CrewMemberFull,
} from "@/data/crewData";

export const Route = createFileRoute("/crew/")({
  head: () => ({
    meta: [
      { title: `Crew — ${site.name}` },
      {
        name: "description",
        content: `Meet the leadership, management, and creative team behind ${site.name}.`,
      },
      { property: "og:title", content: `Crew — ${site.name}` },
      { property: "og:url", content: "/crew" },
    ],
    links: [{ rel: "canonical", href: "/crew" }],
  }),
  component: CrewPage,
});

type CatConfig = {
  id: CrewCategory;
  label: string;
  subtitle: string;
  Icon: React.FC<{ className?: string }>;
  iconClass: string;
  badgeClass: string;
  glowClass: string;
  dividerClass: string;
};

const CATEGORIES: CatConfig[] = [
  {
    id: "leadership",
    label: "Leadership",
    subtitle: "The visionaries leading Fun Media Entertainment.",
    Icon: Crown,
    iconClass: "text-amber-400",
    badgeClass: "bg-amber-400/10 border-amber-400/30 text-amber-400",
    glowClass: "hover:shadow-[0_8px_48px_oklch(0.85_0.18_80/0.20)] hover:border-amber-400/30",
    dividerClass: "from-amber-400/60 via-amber-400/20 to-transparent",
  },
  {
    id: "management",
    label: "Management & Technology",
    subtitle: "The people supporting our team, technology, and operations.",
    Icon: Briefcase,
    iconClass: "text-cyan-400",
    badgeClass: "bg-cyan-400/10 border-cyan-400/30 text-cyan-400",
    glowClass: "hover:shadow-[0_8px_48px_oklch(0.85_0.16_200/0.20)] hover:border-cyan-400/30",
    dividerClass: "from-cyan-400/60 via-cyan-400/20 to-transparent",
  },
  {
    id: "investors",
    label: "Investors",
    subtitle: "The partners supporting our vision and growth.",
    Icon: TrendingUp,
    iconClass: "text-emerald-400",
    badgeClass: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400",
    glowClass: "hover:shadow-[0_8px_48px_oklch(0.72_0.18_145/0.20)] hover:border-emerald-400/30",
    dividerClass: "from-emerald-400/60 via-emerald-400/20 to-transparent",
  },
  {
    id: "artists",
    label: "Creative Artists",
    subtitle: "The creative talent bringing every idea to life.",
    Icon: Sparkles,
    iconClass: "text-violet-400",
    badgeClass: "bg-violet-400/10 border-violet-400/30 text-violet-400",
    glowClass: "hover:shadow-[0_8px_48px_oklch(0.7_0.24_300/0.20)] hover:border-violet-400/30",
    dividerClass: "from-violet-400/60 via-violet-400/20 to-transparent",
  },
];

function getRoleIcon(role: string): React.FC<{ className?: string }> {
  const r = role.toLowerCase();
  if (r.includes("ceo") || r.includes("founder")) return Crown;
  if (r.includes("technical") || r.includes("director")) return Star;
  if (r.includes("hr") || r.includes("human")) return Users;
  if (r.includes("web") || r.includes("developer")) return Code2;
  if (r.includes("investor")) return TrendingUp;
  return Globe;
}

function ProfileCard({
  member,
  cat,
}: {
  member: CrewMemberFull;
  cat: CatConfig;
}) {
  const RoleIcon = getRoleIcon(member.role);

  return (
    <article
      className={[
        "glass group flex flex-col rounded-2xl overflow-hidden border border-white/8",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-2",
        cat.glowClass,
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10">
        {member.photo && (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 [&:not([src=''])]:opacity-100"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className={`absolute top-3 right-3 rounded-full p-2 backdrop-blur-sm border ${cat.badgeClass}`}>
          <RoleIcon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display font-semibold text-sm leading-tight text-foreground">
          {member.name}
        </h3>
        <p className={`mt-1 text-xs font-medium ${cat.iconClass}`}>
          {member.role}
        </p>
        {member.intro && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-1">
            {member.intro}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`/crew/${member.slug}`}
            id={`view-profile-${member.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg btn-neon px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-100"
          >
            View Profile <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ cat }: { cat: CatConfig }) {
  const emptyMessages: Record<CrewCategory, { heading: string; body: string }> = {
    leadership: {
      heading: "Leadership to be announced",
      body: "Stay tuned for more details.",
    },
    management: {
      heading: "Growing our team",
      body: "We are actively expanding our management and technology team.",
    },
    investors: {
      heading: "Partners announced soon",
      body: "We are grateful for every partner who believes in our vision.",
    },
    artists: {
      heading: "Creative team growing",
      body: "We are actively recruiting 3D Modelers, Animators, Riggers, Lighting Artists, and more.",
    },
  };
  const msg = emptyMessages[cat.id];

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-white/10">
      <div className={`rounded-2xl p-4 border ${cat.badgeClass} mb-4`}>
        <cat.Icon className="w-7 h-7" />
      </div>
      <p className="font-display font-semibold text-sm">{msg.heading}</p>
      <p className="mt-1 text-xs text-muted-foreground max-w-xs">{msg.body}</p>
    </div>
  );
}

function CategorySection({ cat }: { cat: CatConfig }) {
  const members = getCrewByCategory(cat.id);

  return (
    <section id={`crew-${cat.id}`} className="scroll-mt-24">
      <div className="flex items-start gap-4 mb-8">
        <div className={`rounded-xl p-3 border flex-shrink-0 ${cat.badgeClass}`}>
          <cat.Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl md:text-2xl font-semibold leading-tight text-foreground">
            {cat.label}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{cat.subtitle}</p>
          <div className={`mt-3 h-px bg-gradient-to-r ${cat.dividerClass}`} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.length > 0 ? (
          members.map((m) => <ProfileCard key={m.slug} member={m} cat={cat} />)
        ) : (
          <EmptyState cat={cat} />
        )}
      </div>
    </section>
  );
}

import type React from "react";

function CrewPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
        Our team
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-6xl text-white">
        Crew of <span className="gradient-text">{site.name}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Meet the dedicated team of visionaries, technologists, and creative
        professionals behind Fun Media Entertainment.
      </p>

      <nav aria-label="Crew categories" className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#crew-${cat.id}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${cat.badgeClass}`}
          >
            <cat.Icon className="w-3 h-3" />
            {cat.label}
          </a>
        ))}
      </nav>

      <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mt-16 space-y-24">
        {CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
