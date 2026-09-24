"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
  className?: string;
};

/** Generic scroll-triggered entrance: fade + rise into view. */
export function Reveal({
  children,
  as,
  y = 40,
  delay = 0,
  duration = 0.8,
  start = "top 85%",
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once },
      });
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
