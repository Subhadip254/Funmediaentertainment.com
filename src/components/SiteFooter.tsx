import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      const { data } = await supabase
        .from("ratings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20); // Get latest 20 to avoid crashing with too many
      if (data) {
        setFeedbacks(data);
      }
    }
    fetchFeedbacks();
  }, []);

  return (
    <footer className="mt-32 border-t border-white/10 bg-background/60">
      {/* Feedbacks Marquee */}
      {feedbacks.length > 0 && (
        <div className="border-b border-white/10 overflow-hidden whitespace-nowrap bg-white/5 py-3 flex items-center">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee-scroll {
              display: inline-block;
              animation: marquee 30s linear infinite;
              padding-right: 100vw;
            }
            .animate-marquee-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="animate-marquee-scroll text-sm flex gap-12">
            {feedbacks.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                <span className="font-semibold text-primary">{f.name}</span>
                <span className="text-muted-foreground">({f.role}):</span> 
                <span className="italic">"{f.comments}"</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt={site.name} className="h-10 w-auto" />
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {site.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Studio</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/crew" className="hover:text-foreground">Crew</Link></li>
            <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/ratings" className="hover:text-foreground">Ratings & Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Get in touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-foreground font-semibold text-foreground/90">
                {site.email}
              </a>
            </li>
            <li className="text-xs text-muted-foreground/80 leading-relaxed max-w-[200px]">
              Purba Medinipur, West Bengal, 721659
            </li>
            <li className="pt-2"><a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a></li>
            <li><a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a></li>
            <li><a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">YouTube</a></li>
            <li><a href={site.socials.behance} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Behance</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {year} {site.name}. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
