"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { ThemeSection } from "@/components/layout/ThemeSection";
import { SplitText } from "@/components/ui/SplitText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { phases } from "@/content/method";

export function MethodIntro() {
  const namesRef = useRef<HTMLDivElement>(null);

  // Illuminate each phase name to accent in sequence as you scroll through.
  useIsomorphicLayoutEffect(() => {
    const root = namesRef.current;
    if (!root || prefersReducedMotion()) return;
    const items = root.querySelectorAll<HTMLElement>("[data-phase-name]");

    const ctx = gsap.context(() => {
      gsap.to(items, {
        color: "var(--color-accent)",
        stagger: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, namesRef);

    return () => ctx.revert();
  }, []);

  return (
    <ThemeSection theme="light" id="method">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-40 text-center">
        <Eyebrow>HOW IT WORKS</Eyebrow>
        <h2
          className="mt-8 font-display font-medium leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
        >
          <SplitText by="char" stagger={0.02}>
            Contact to closed, on autopilot
          </SplitText>
        </h2>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
          Autopilot runs the same loop for every contact — capture, organize,
          automate, remind, grow. You set it up once; the agent handles the
          follow-ups, and the CRM keeps score. No spreadsheets, no reminders to
          send the reminders.
        </p>

        <div
          ref={namesRef}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          {phases.map((p, i) => (
            <span key={p.id} className="flex items-center gap-4">
              <span data-phase-name>{p.title}</span>
              {i < phases.length - 1 && (
                <span className="text-[var(--fg-muted)]/50" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </ThemeSection>
  );
}
