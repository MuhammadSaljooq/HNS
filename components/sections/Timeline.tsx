"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { milestones } from "@/content/about";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    const fill = fillRef.current;
    if (!root || !fill || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        },
      );
      gsap.from(root.querySelectorAll("[data-milestone]"), {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-32">
      <div className="mb-14">
        <Eyebrow>MILESTONES</Eyebrow>
      </div>
      <div ref={ref} className="relative pl-10">
        {/* Rule + animated fill */}
        <div className="absolute bottom-0 left-1.5 top-2 w-px bg-white/15">
          <div
            ref={fillRef}
            className="absolute inset-0 origin-top scale-y-0 bg-accent"
          />
        </div>

        <ol className="flex flex-col gap-12">
          {milestones.map((m) => (
            <li key={m.year} data-milestone className="relative">
              <span className="absolute -left-[2.15rem] top-1.5 size-3 rounded-full border border-accent bg-ink" />
              <div className="flex flex-col gap-1">
                <span className="font-display text-sm text-accent">
                  {m.year}
                </span>
                <span className="font-display text-xl tracking-tight">
                  {m.title}
                </span>
                <span className="text-sm text-muted-dark">{m.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
