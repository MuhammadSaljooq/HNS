"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

export type ThemeSectionProps = {
  theme: "dark" | "light";
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * A section whose background wipes up (clip-path) as it enters, producing the
 * dark↔light theme flips. Child text uses text-[var(--fg)] and the section sets
 * --fg / --fg-muted via [data-theme].
 */
export function ThemeSection({
  theme,
  children,
  className,
  id,
}: ThemeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    if (prefersReducedMotion()) {
      bg.style.clipPath = "none";
      return;
    }

    const ctx = gsap.context(() => {
      // Swoop: a curved edge rises from the bottom-center and flattens as it
      // covers the section — an arc wipe instead of a straight line.
      gsap.fromTo(
        bg,
        { clipPath: "ellipse(75% 0% at 50% 100%)" },
        {
          clipPath: "ellipse(150% 140% at 50% 100%)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 45%",
            scrub: 0.6,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-theme={theme}
      className={cn("relative isolate text-[var(--fg)]", className)}
    >
      {/* Background layer that wipes in. */}
      <div
        ref={bgRef}
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          theme === "light" ? "bg-paper" : "bg-ink",
        )}
        style={{ clipPath: "ellipse(75% 0% at 50% 100%)" }}
      >
        <div
          className={cn(
            "dot-grid absolute inset-0",
            theme === "light" && "!opacity-[0.04]",
          )}
        />
      </div>
      {children}
    </section>
  );
}
