"use client";

import { useRef, useState } from "react";
import { ThemeSection } from "@/components/layout/ThemeSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { testimonials, type Testimonial } from "@/content/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-accent" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[85vw] shrink-0 snap-start flex-col rounded-2xl border border-ink/15 p-10 md:w-[38rem]">
      <Stars rating={t.rating} />
      <blockquote className="mt-6 text-xl leading-relaxed md:text-2xl">
        “{t.quote}”
      </blockquote>
      <div className="my-8 h-px w-full bg-ink/10" />
      <figcaption className="text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)]">
        {t.author} — {t.role}, {t.company}
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const drag = useRef<{ down: boolean; startX: number; startLeft: number }>({
    down: false,
    startX: 0,
    startLeft: 0,
  });

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("figure");
    const amount = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // Pointer drag-to-scroll.
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.down = false;
    scrollerRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <ThemeSection theme="light" id="testimonials">
      <div className="py-32">
        <div className="mx-auto mb-12 flex max-w-7xl flex-col gap-6 px-6">
          <Eyebrow>WHAT CLIENTS SAY</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              className="max-w-2xl font-display font-medium leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
            >
              The follow-ups they stopped forgetting.
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                className="flex size-11 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                className="flex size-11 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={updateEdges}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 [scroll-padding-left:1.5rem]"
          style={{ cursor: "grab" }}
        >
          {testimonials.map((t) => (
            <Card key={t.author} t={t} />
          ))}
          {/* trailing spacer so the last card can reach the left edge */}
          <div className="w-6 shrink-0" aria-hidden />
        </div>
      </div>
    </ThemeSection>
  );
}
