import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { site } from "@/config/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/crew", label: "Crew" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
  { to: "/ratings", label: "Ratings" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "glass" : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt={site.name}
            className="h-9 w-auto object-contain"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative text-sm font-medium transition-colors hover:text-foreground py-1"
              style={{ color: '#DCE7F7' }}
              activeProps={{
                className: "font-semibold",
                style: { color: '#38CFFF' },
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && (
                    <span 
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #38CFFF, #5B8CFF)', boxShadow: '0 0 8px #38CFFF' }}
                    />
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        <button
          className="rounded-md p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-white/10 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-200"
                activeProps={{ className: "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none font-semibold pl-4" }}
                activeOptions={{ exact: n.to === "/" }}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
