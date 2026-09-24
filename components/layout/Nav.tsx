"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useLenis } from "@/components/layout/SmoothScroll";
import { site, type NavItem } from "@/content/site";
import { phases } from "@/content/method";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Wordmark with the last two characters accent-colored. */
function Wordmark() {
  const name = site.name;
  const head = name.slice(0, Math.max(0, name.length - 2));
  const tail = name.slice(Math.max(0, name.length - 2));
  return (
    <Link href="/" className="group flex flex-col leading-none" aria-label={site.fullName}>
      <span className="font-display text-lg tracking-tight">
        {head}
        <span className="text-accent">{tail}</span>
      </span>
      <span className="mt-1 flex gap-1" aria-hidden>
        {phases.map((p, i) => (
          <span
            key={p.id}
            className={cn(
              "size-1 rounded-full",
              i === phases.length - 1 ? "bg-accent" : "bg-white/30",
            )}
          />
        ))}
      </span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const lenis = useLenis();
  const pillRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const quickH = useRef<((v: number) => void) | null>(null);
  const quickY = useRef<((v: number) => void) | null>(null);

  // Anchor scrolling via Lenis for same-page hashes.
  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    if (!href.includes("#")) return;
    const [path, hash] = href.split("#");
    const onThisPage = path === "" || path === "/" ? pathname === "/" : false;
    if (onThisPage && hash) {
      const target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        setMobileOpen(false);
        if (lenis) lenis.scrollTo(target, { offset: -100 });
        else target.scrollIntoView({ behavior: "auto" });
      }
    }
  };

  // Pill shrink + hide/show on scroll.
  useIsomorphicLayoutEffect(() => {
    const pill = pillRef.current;
    const wrap = wrapRef.current;
    if (!pill || !wrap || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      quickH.current = gsap.quickTo(pill, "height", {
        duration: 0.3,
        ease: "power2.out",
      });
      quickY.current = gsap.quickTo(wrap, "yPercent", {
        duration: 0.4,
        ease: "power2.out",
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const vh = window.innerHeight;
          // Shrink after 100px.
          quickH.current?.(y > 100 ? 56 : 64);
          pill.style.backgroundColor =
            y > 100 ? "rgba(20,20,22,0.85)" : "rgba(20,20,22,0.6)";
          // Hide when scrolling down past 60% vh; show on scroll up.
          if (self.direction === 1 && y > vh * 0.6) {
            quickY.current?.(-150);
          } else {
            quickY.current?.(0);
          }
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  // Close dropdowns/mobile on route change, outside click, Escape.
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  // Lock body scroll while mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      ref={wrapRef}
      className="fixed left-1/2 top-6 z-50 w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2"
    >
      <div
        ref={pillRef}
        className="flex items-center justify-between rounded-full border border-white/10 px-6 backdrop-blur-xl md:px-8"
        style={{ height: 64, backgroundColor: "rgba(20,20,22,0.6)" }}
      >
        <Wordmark />

        {/* Desktop links */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              open={openDropdown === item.label}
              onToggle={() =>
                setOpenDropdown((cur) =>
                  cur === item.label ? null : item.label,
                )
              }
              onHover={(v) => setOpenDropdown(v ? item.label : null)}
              onAnchor={handleAnchor}
            />
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden size-10 items-center justify-center rounded-full text-paper/70 transition-colors hover:text-accent lg:flex"
          >
            <SearchIcon />
          </button>
          <div className="hidden lg:block">
            <Button href="/contact" variant="primary" className="h-10 px-5">
              Start free
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full text-paper lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                  mobileOpen && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300",
                  mobileOpen && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && <MobilePanel onAnchor={handleAnchor} />}
    </header>
  );
}

function NavLink({
  item,
  open,
  onToggle,
  onHover,
  onAnchor,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onHover: (v: boolean) => void;
  onAnchor: (href: string) => (e: React.MouseEvent) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const hasChildren = !!item.children?.length;

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.35 },
      );
      gsap.fromTo(
        panel.querySelectorAll("a"),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.03, delay: 0.05 },
      );
    }, panelRef);
    return () => ctx.revert();
  }, [open]);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onAnchor(item.href)}
        className="text-xs uppercase tracking-[0.15em] text-paper/80 transition-colors hover:text-accent"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`dropdown-${item.label}`}
        onClick={onToggle}
        className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-paper/80 transition-colors hover:text-accent"
      >
        {item.label}
        <span aria-hidden className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>
      {open && (
        // Outer wrapper touches the trigger (top-full, no margin) and carries the
        // visual gap as padding — so it stays a hoverable descendant and the
        // menu doesn't close when the cursor crosses into it.
        <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4">
          <div
            id={`dropdown-${item.label}`}
            ref={panelRef}
            className="rounded-2xl border border-white/10 bg-ink-soft/95 p-2 backdrop-blur-xl"
          >
            {item.children!.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                onClick={onAnchor(child.href)}
                className="block rounded-xl px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-paper/75 transition-colors hover:bg-white/5 hover:text-accent"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobilePanel({
  onAnchor,
}: {
  onAnchor: (href: string) => (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-mobile-link]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-3 max-h-[80vh] overflow-y-auto rounded-3xl border border-white/10 bg-ink-soft/95 p-6 backdrop-blur-xl lg:hidden"
    >
      <ul className="flex flex-col gap-1">
        {site.nav.map((item) => (
          <li key={item.label} data-mobile-link>
            <Link
              href={item.href}
              onClick={onAnchor(item.href)}
              className="block py-3 font-display text-2xl tracking-tight text-paper hover:text-accent"
            >
              {item.label}
            </Link>
            {item.children && (
              <ul className="mb-2 ml-1 flex flex-col gap-1 border-l border-white/10 pl-4">
                {item.children.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      onClick={onAnchor(child.href)}
                      className="block py-1.5 text-xs uppercase tracking-[0.12em] text-paper/60 hover:text-accent"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6" data-mobile-link>
        <Button href="/contact" variant="primary" className="w-full">
          Start free
        </Button>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
