"use client";

import Link from "next/link";
import { useLenis } from "@/components/layout/SmoothScroll";
import { site } from "@/content/site";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Software & Product", href: "/services#software" },
      { label: "Cloud & Platform", href: "/services#cloud" },
      { label: "Data & AI", href: "/services#data-ai" },
      { label: "Business Systems", href: "/services#business" },
      { label: "Growth", href: "/services#growth" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Method", href: "/#method" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "AI Reminder Agent", href: "/services#automation" },
      { label: "Built-in CRM", href: "/services#automation" },
      { label: "Book a demo", href: "/contact" },
    ],
  },
];

export function Footer() {
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="sticky bottom-0 z-0 overflow-hidden bg-ink-soft">
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-24">
        {/* Oversized wordmark flourish */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-display font-bold leading-none text-white/[0.05]"
          style={{ fontSize: "18vw" }}
        >
          {site.name}
        </span>

        <div className="relative grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl tracking-tight">
              {site.name.slice(0, -2)}
              <span className="text-accent">{site.name.slice(-2)}</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/50">
              {site.fullName}. {site.tagline}.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.15em] text-paper/40">
              {site.location}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-paper/40">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-paper/70 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="relative mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.15em] text-paper/60 transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
            <button
              type="button"
              onClick={toTop}
              className="text-xs uppercase tracking-[0.15em] text-paper/60 transition-colors hover:text-accent"
            >
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
