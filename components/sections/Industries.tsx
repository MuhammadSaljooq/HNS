"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { ThemeSection } from "@/components/layout/ThemeSection";
import { Eyebrow } from "@/components/ui/Eyebrow";

const industryTags = [
  "Fintech",
  "Healthcare",
  "Logistics",
  "Retail & E-commerce",
  "SaaS",
  "Energy",
  "Manufacturing",
  "Media",
  "Education",
  "Real Estate",
  "Public Sector",
];

export function Industries() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-pill]"), {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <ThemeSection theme="dark" id="industries">
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <div className="mb-12 flex justify-center">
          <Eyebrow>WHERE WE WORK</Eyebrow>
        </div>
        <div ref={ref} className="flex flex-wrap justify-center gap-3">
          {industryTags.map((tag) => (
            <span
              key={tag}
              data-pill
              className="cursor-default rounded-full border border-white/20 px-5 py-2.5 text-sm transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </ThemeSection>
  );
}
