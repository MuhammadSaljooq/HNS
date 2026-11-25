"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { site } from "@/content/site";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    const glow = glowRef.current;
    if (!root || !glow || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(glow, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-theme="ink"
      className="relative z-10 flex min-h-screen shadow-[0_2px_0_0_var(--color-ink)] flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-paper"
    >
      <div className="dot-grid pointer-events-none absolute inset-0" />
      {/* Accent radial glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-ink opacity-[0.12] blur-[140px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <Eyebrow>PUT FOLLOW-UPS ON AUTOPILOT</Eyebrow>
        <h2
          className="mt-8 max-w-5xl font-display font-medium leading-[0.9] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.75rem, 8vw, 6.5rem)" }}
        >
          <SplitText by="char" stagger={0.02}>
            Ready to stop
          </SplitText>
          <br />
          <SplitText by="char" stagger={0.02} delay={0.2}>
            chasing people
          </SplitText>
          <span className="text-accent-ink">?</span>
        </h2>

        <div className="mt-12 flex flex-col items-center gap-8">
          <Button
            href="/contact"
            variant="primary"
            className="hover:text-white"
          >
            Start free
          </Button>
          <MagneticLink
            href={`mailto:${site.email}`}
            className="font-display text-xl tracking-tight text-paper/80 underline decoration-paper/30 decoration-1 underline-offset-8 transition-colors hover:text-paper hover:decoration-accent-ink md:text-3xl"
          >
            {site.email}
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
