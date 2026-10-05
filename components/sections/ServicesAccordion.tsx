"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { serviceGroups } from "@/content/services";
import { cn } from "@/lib/utils";

export function ServicesAccordion() {
  const [open, setOpen] = useState<string>(serviceGroups[0].id);

  // Deep links like /services#cloud open the matching row. Next's <Link>
  // changes the hash via pushState (no hashchange event), so also catch
  // clicks on in-page service links.
  useEffect(() => {
    const ids = new Set(serviceGroups.map((g) => g.id));
    const openFromHash = (hash: string) => {
      const id = hash.replace(/^#/, "");
      if (ids.has(id)) setOpen(id);
    };
    openFromHash(window.location.hash);

    const onHashChange = () => openFromHash(window.location.hash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const url = new URL((a as HTMLAnchorElement).href, window.location.href);
      if (url.pathname === window.location.pathname) openFromHash(url.hash);
    };
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {serviceGroups.map((group) => (
        <AccordionRow
          key={group.id}
          id={group.id}
          title={group.title}
          summary={group.summary}
          flagship={group.flagship}
          isOpen={open === group.id}
          onToggle={() => setOpen((cur) => (cur === group.id ? "" : group.id))}
          services={group.services}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  id,
  title,
  summary,
  flagship,
  isOpen,
  onToggle,
  services,
}: {
  id: string;
  title: string;
  summary?: string;
  flagship?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  services: { name: string; blurb: string; flag?: "ai" | "popular" }[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Animate height to "auto" with GSAP (no CSS max-height hack).
  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (prefersReducedMotion()) {
      panel.style.height = isOpen ? "auto" : "0px";
      panel.style.opacity = isOpen ? "1" : "0";
      return;
    }

    const tween = isOpen
      ? gsap.to(panel, {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => ScrollTrigger.refresh(),
        })
      : gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });

    return () => {
      tween.kill();
    };
  }, [isOpen]);

  return (
    <div id={id} className="scroll-mt-32 border-b border-white/10">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`acc-${id}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-8 text-left"
      >
        <span className="flex items-baseline gap-4">
          <span
            className={cn(
              "font-display tracking-tight",
              flagship && "text-accent",
            )}
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)" }}
          >
            {title}
          </span>
          {flagship && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-ink">
              flagship
            </span>
          )}
        </span>
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-2xl text-paper/60 transition-transform duration-300",
            isOpen && "rotate-45 text-accent",
          )}
        >
          +
        </span>
      </button>

      <div
        id={`acc-${id}`}
        ref={panelRef}
        className="overflow-hidden"
        style={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="pb-10">
          {summary && (
            <p className="mb-6 max-w-2xl text-sm text-muted-dark">{summary}</p>
          )}
          <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.name}
                className="flex flex-col gap-1 border-t border-white/10 pt-3"
              >
                <span className="flex items-center gap-2 text-sm">
                  {s.name}
                  {s.flag === "ai" && <span className="text-accent">✦</span>}
                  {s.flag === "popular" && (
                    <span className="rounded-full border border-accent/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-accent">
                      popular
                    </span>
                  )}
                </span>
                <span className="text-xs text-paper/45">{s.blurb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
