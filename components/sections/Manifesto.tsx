"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { manifesto } from "@/content/about";

/** Large paragraph where words brighten as they scroll through view. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = manifesto.split(" ");

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const spans = el.querySelectorAll("[data-word]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { opacity: 0.2 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.3,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-32">
      <div className="mb-10">
        <Eyebrow>WHY WE EXIST</Eyebrow>
      </div>
      <p
        ref={ref}
        className="font-display leading-[1.15] tracking-tight"
        style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
      >
        {words.map((w, i) => (
          <span key={i} data-word style={{ opacity: 0.2 }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </section>
  );
}
