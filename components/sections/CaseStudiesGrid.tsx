"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { caseStudies, industries } from "@/content/case-studies";
import { cn } from "@/lib/utils";

/** Deterministic-ish accent tint per card, varied by index. */
const tints = [
  "from-ink-soft to-[#1b2410]",
  "from-ink-soft to-[#101a24]",
  "from-ink-soft to-[#241016]",
  "from-ink-soft to-[#161024]",
  "from-ink-soft to-[#102420]",
  "from-ink-soft to-[#242010]",
];

export function CaseStudiesGrid() {
  const params = useSearchParams();
  const initial = params.get("industry") ?? "All";
  const [filter, setFilter] = useState<string>(
    industries.includes(initial) ? initial : "All",
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? caseStudies
        : caseStudies.filter((c) => c.industry === filter),
    [filter],
  );

  // Fade/stagger the grid in whenever the filter changes.
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.querySelectorAll("[data-card]"),
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        },
      );
    }, gridRef);
    return () => ctx.revert();
  }, [filter]);

  const filters = ["All", ...industries];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-32">
      {/* Filter row */}
      <div className="mb-12 flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
              filter === f
                ? "border-accent bg-accent text-ink"
                : "border-white/20 text-paper/70 hover:border-accent hover:text-accent",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((study, i) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            data-card
            className="group flex flex-col"
          >
            {/* Cover placeholder (4:3) */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-[1.06]",
                  tints[i % tints.length],
                )}
              />
              <div className="dot-grid absolute inset-0" />
              <span className="absolute bottom-4 left-5 font-display text-7xl leading-none text-white/10">
                {study.client.charAt(0)}
              </span>
              <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-ink/40 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-paper/70 backdrop-blur">
                {study.metrics[0].value} {study.metrics[0].label}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-paper/45">
                <span className="text-paper/70">{study.client}</span>
                <span>
                  {study.industry} · {study.year}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug tracking-tight transition-colors group-hover:text-accent">
                {study.headline}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
