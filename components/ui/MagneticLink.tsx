"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

export type MagneticLinkProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
  href?: string;
};

/**
 * Pulls its inner content toward the cursor. Disabled on touch devices and
 * under reduced motion.
 */
export function MagneticLink({
  children,
  strength = 0.3,
  className,
  href,
}: MagneticLinkProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;
    if (isTouch || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(inner, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(inner, "y", { duration: 0.4, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };

      const onLeave = () => {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
        });
      };

      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);

      return () => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    }, wrapRef);

    return () => ctx.revert();
  }, [strength]);

  const Tag = (href ? "a" : "span") as "a" | "span";

  return (
    <Tag
      // @ts-expect-error ref type differs between a/span but both are HTMLElement
      ref={wrapRef}
      href={href}
      className={cn("inline-block", className)}
    >
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
