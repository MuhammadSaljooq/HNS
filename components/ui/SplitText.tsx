"use client";

import { useRef, type ElementType } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

type SplitBy = "char" | "word";
type Trigger = "scroll" | "mount" | "manual";

export type SplitTextProps = {
  children: string;
  as?: ElementType;
  by?: SplitBy;
  stagger?: number;
  delay?: number;
  trigger?: Trigger;
  className?: string;
  /** For trigger="manual": flip to true to play. */
  play?: boolean;
};

/**
 * Splits a string into masked, staggered units that rise from behind an
 * overflow-hidden parent — the "text reveal from behind a mask" effect.
 *
 * Characters are grouped by word (nowrap) so lines only ever break at spaces —
 * never mid-word.
 *
 * a11y: the wrapper carries aria-label; every split span is aria-hidden, so
 * screen readers read the sentence, not the individual letters.
 */
export function SplitText({
  children,
  as,
  by = "char",
  stagger,
  delay = 0,
  trigger = "scroll",
  className,
  play = false,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "span") as ElementType;
  const resolvedStagger = stagger ?? (by === "char" ? 0.02 : 0.06);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion renders the plain string (see JSX below) — nothing to do.
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const inners = el.querySelectorAll<HTMLElement>("[data-split-inner]");
      if (!inners.length) return;

      gsap.set(inners, { yPercent: 110, opacity: 0 });

      const animate = () =>
        gsap.to(inners, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: resolvedStagger,
          delay,
        });

      if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: animate,
        });
      } else if (trigger === "mount") {
        animate();
      }
      // "manual" is handled by the play-effect below.
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, by, trigger]);

  // Manual trigger: play when `play` flips true.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || trigger !== "manual" || !play || prefersReducedMotion()) return;
    const inners = el.querySelectorAll<HTMLElement>("[data-split-inner]");
    const tween = gsap.to(inners, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: resolvedStagger,
      delay,
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, trigger]);

  // Reduced motion: plain string, no spans.
  if (prefersReducedMotion()) {
    return <Tag className={className}>{children}</Tag>;
  }

  // Tokenize into words + whitespace; whitespace stays a breakable space.
  const tokens = children.split(/(\s+)/).filter((t) => t.length > 0);

  return (
    <Tag ref={ref} aria-label={children} className={cn("inline", className)}>
      {tokens.map((token, ti) => {
        if (/^\s+$/.test(token)) {
          // Real, breakable space between words.
          return <span key={ti}> </span>;
        }

        if (by === "word") {
          return (
            <span
              key={ti}
              aria-hidden
              className="inline-block overflow-hidden align-bottom"
            >
              <span
                data-split-inner
                className="inline-block will-change-transform"
              >
                {token}
              </span>
            </span>
          );
        }

        // char mode: keep each word's letters on one line (no mid-word break).
        return (
          <span key={ti} aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(token).map((ch, ci) => (
              <span
                key={ci}
                className="inline-block overflow-hidden align-bottom"
              >
                <span
                  data-split-inner
                  className="inline-block will-change-transform"
                >
                  {ch}
                </span>
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
